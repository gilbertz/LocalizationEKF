//
//  ViewController.m
//  LocalizationEKF
//
//  Created by zhao on 16/3/21.
//  Copyright © 2016年 zhao. All rights reserved.
//

#import "ViewController.h"
#import "DDLog.h"
#import "DDFileLogger.h"
#import "DDTTYLogger.h"
#import "HHLogFormatter.h"
#import "HighpassFilter.h"
#import <CoreBluetooth/CoreBluetooth.h>
#import <CoreLocation/CoreLocation.h>
#import <CoreMotion/CoreMotion.h>
#import "C3Beacon.h"


#define LOG_LEVEL_DEF      DDLogLevelAll

static NSString * const kUUID = @"23A01AF0-232A-4518-9C0E-323FB773F5EF";
static NSString * const kIdentifier = @"SomeIdentifier";

#define kUpdateFrequency    60.0
static double timeInterval = 1.0/kUpdateFrequency;


@interface ViewController ()<UIWebViewDelegate,CLLocationManagerDelegate>{
    double lastAx[4],lastAy[4],lastAz[4];
    int countX, countY, countZ, accCount;
    double lastVx, lastVy, lastVz, maxV;
    int type;
    int distanceCount;
    double distance;
    int longdistanceCount;
    double longdistance;
    double lat;
    double lon;
    double heading;
    double beacon_lat;
    double beacon_lon;
    unsigned long beaconNo;
    HighpassFilter * filter;
}
@property (strong, nonatomic) DDFileLogger* fileLogger;
@property (strong, nonatomic) UIWebView *myWebView;
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) CLBeaconRegion *beaconRegion;
@property (nonatomic, strong) NSArray *detectedBeacons;
@property(nonatomic, strong)CMMotionManager *motionManager;
@property(nonatomic, strong)NSMutableArray *beaconList;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

/********************数据记录**************************/
    _fileLogger = [[DDFileLogger alloc] init];
    _fileLogger.rollingFrequency = 60 * 60 * 24; // 24 hour rolling
    _fileLogger.logFileManager.maximumNumberOfLogFiles = 7; // a weeks worth
    [DDLog removeAllLoggers];
    [DDLog addLogger:_fileLogger];
    
    HHLogFormatter* logFormatter = [[HHLogFormatter alloc]init];
    [_fileLogger setLogFormatter:logFormatter];
    [[DDTTYLogger sharedInstance] setLogFormatter:logFormatter];
/********************地图显示页面**********************/
    self.myWebView = [[UIWebView alloc] initWithFrame:self.view.bounds];
    self.myWebView.backgroundColor = [UIColor whiteColor];
    
    NSString *localHTMLPageFilePath = [[NSBundle mainBundle] pathForResource:@"LocalizationMap-master/index" ofType:@"html"];
    NSURL *localHTMLPageFileURL = [NSURL fileURLWithPath:localHTMLPageFilePath];
    [self.myWebView loadRequest:[NSURLRequest requestWithURL:localHTMLPageFileURL]];
    self.myWebView.delegate=self;
    self.myWebView.scalesPageToFit = YES;
    [self.view addSubview:self.myWebView];
/*********************开启位置服务*************************/
    [self createLocationManager];
/*********************开启iBeacon服务*********************/
    [self startRangingForBeacons];
    [self initBeacon];
/*********************用于获取经纬度和航向角****************/
    [self.locationManager startUpdatingLocation];
    [self.locationManager startUpdatingHeading];
/*********************通过加速度计来获取位移****************/
    lastVx = 0, lastVy = 0, lastVz = 0;
    accCount = maxV = type = 0;
    distanceCount = 1;
    distance = 0;
    longdistanceCount = 1;
    longdistance = 0;
    
    for (int i = 0; i < 4; ++i){
        lastAx[i] = lastAy[i] = lastAz[i] = 0;
    }
    
    self.motionManager = [[CMMotionManager alloc] init];
    self.motionManager.deviceMotionUpdateInterval = timeInterval;
    
    filter = [[HighpassFilter alloc] initWithSampleRate:kUpdateFrequency cutoffFrequency:5.0];
    
    [self.motionManager startDeviceMotionUpdatesToQueue:[NSOperationQueue currentQueue]
                                 withHandler:^(CMDeviceMotion *data, NSError *error) {
                                     [self outputAccelertion:data];
                                 }];

}

- (NSData *)toJSONData:(id)theData{
    
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:theData options:NSJSONWritingPrettyPrinted error:&error];
    if ([jsonData length] > 0 && error == nil){
        return jsonData;
    }else{
        return nil;
    }
}

#pragma mark - creatLocationManager
- (void)createLocationManager
{
    if (!self.locationManager) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation;
    }
}

#pragma mark - iBeacon
- (void)startRangingForBeacons
{
    
    [self checkLocationAccessForRanging];
    
    self.detectedBeacons = [NSArray array];
    
    [self turnOnRanging];
}


- (void)checkLocationAccessForRanging {
    if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
        [self.locationManager requestWhenInUseAuthorization];
    }
}

- (void)turnOnRanging
{
    NSLog(@"Turning on ranging...");
    
    if (![CLLocationManager isRangingAvailable]) {
        NSLog(@"Couldn't turn on ranging: Ranging is not available.");
        return;
    }
    
    if (self.locationManager.rangedRegions.count > 0) {
        NSLog(@"Didn't turn on ranging: Ranging already on.");
        return;
    }
    
    [self createBeaconRegion];
    [self.locationManager startRangingBeaconsInRegion:self.beaconRegion];
    
    NSLog(@"Ranging turned on for region: %@.", self.beaconRegion);
}

- (void)createBeaconRegion
{
    if (self.beaconRegion)
        return;
    NSUUID *proximityUUID = [[NSUUID alloc] initWithUUIDString:kUUID];
    self.beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:proximityUUID identifier:kIdentifier];
    self.beaconRegion.notifyEntryStateOnDisplay = YES;
}

- (void)stopRangingForBeacons
{
    if (self.locationManager.rangedRegions.count == 0) {
        NSLog(@"Didn't turn off ranging: Ranging already off.");
        return;
    }
    
    [self.locationManager stopRangingBeaconsInRegion:self.beaconRegion];
    
    self.detectedBeacons = [NSArray array];
    
    NSLog(@"Turned off ranging.");
}

#pragma mark - Location manager delegate methods
- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    if (![CLLocationManager locationServicesEnabled]) {
        NSLog(@"Couldn't turn on ranging: Location services are not enabled.");
        return;
        
    }
    
    CLAuthorizationStatus authorizationStatus = [CLLocationManager authorizationStatus];
    switch (authorizationStatus) {
        case kCLAuthorizationStatusAuthorizedAlways:
            return;
            
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            
            return;
            
        default:
            NSLog(@"Couldn't turn on monitoring: Required Location Access(WhenInUse) missing.");
            return;
            break;
    }
}

- (void)locationManager:(CLLocationManager *)manager
        didRangeBeacons:(NSArray *)beacons
               inRegion:(CLBeaconRegion *)region {
    NSArray *filteredBeacons = [self filteredBeacons:beacons];
    
    if (filteredBeacons.count == 0) {
        NSLog(@"No beacons found nearby.");
        beacon_lat = 0.0;
        beacon_lon = 0.0;
    } else {
        NSLog(@"Found %lu %@.", (unsigned long)[filteredBeacons count],
              [filteredBeacons count] > 1 ? @"beacons" : @"beacon");
        
    }
    self.detectedBeacons = filteredBeacons;
}

- (NSArray *)filteredBeacons:(NSArray *)beacons
{
    // Filters duplicate beacons out; this may happen temporarily if the originating device changes its Bluetooth id
    NSMutableArray *mutableBeacons = [beacons mutableCopy];
    
    NSMutableSet *lookup = [[NSMutableSet alloc] init];
    for (int index = 0; index < [beacons count]; index++) {
        CLBeacon *curr = [beacons objectAtIndex:index];
        NSString *identifier = [NSString stringWithFormat:@"%@/%@", curr.major, curr.minor];
        
        // this is very fast constant time lookup in a hash table
        if ([lookup containsObject:identifier]) {
            [mutableBeacons removeObjectAtIndex:index];
        } else {
            [lookup addObject:identifier];
        }
    }
    
    return [mutableBeacons copy];
}

#pragma mark - 更新经纬度
-(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations{
    
    //locations数组里边存放的是CLLocation对象，一个CLLocation对象就代表着一个位置
    CLLocation *loc = [locations firstObject];
    lat = loc.coordinate.latitude;
    lon = loc.coordinate.longitude;
}

#pragma mark - 更新航向角
- (void)locationManager:(CLLocationManager *)manager
       didUpdateHeading:(CLHeading *)newHeading {
    heading = newHeading.trueHeading;
}

#pragma mark - 加速度计输出位移
- (void)outputAccelertion:(CMDeviceMotion*)data
{
    CMAcceleration acc = [data userAcceleration];
    CMAcceleration gacc = [data gravity];
    acc.x += gacc.x, acc.y += gacc.y, acc.z += gacc.z;
    CMRotationMatrix rot = [data attitude].rotationMatrix;
    CMAcceleration accRef;
    
    //first correct the direction
    accRef.x = acc.x*rot.m11 + acc.y*rot.m12 + acc.z*rot.m13;
    accRef.y = acc.x*rot.m21 + acc.y*rot.m22 + acc.z*rot.m23;
    accRef.z = acc.x*rot.m31 + acc.y*rot.m32 + acc.z*rot.m33;
    
    //filter the data
    [filter addAcceleration:accRef];
    
    //add threshold
    accRef.x = (fabs(filter.x) < 0.03) ? 0 : filter.x;
    accRef.y = (fabs(filter.y) < 0.03) ? 0 : filter.y;
    accRef.z = (fabs(filter.z) < 0.03) ? 0 : filter.z;
    
    //we use simpson 3/8 integration method here
    accCount = (accCount+1)%4;
    
    lastAx[accCount] = accRef.x, lastAy[accCount] = accRef.y, lastAz[accCount] = accRef.z;
    
    if (accCount == 3){
        lastVx += (lastAx[0]+lastAx[1]*3+lastAx[2]*3+lastAx[3]) * 0.125 * timeInterval * 3;
        lastVy += (lastAy[0]+lastAy[1]*3+lastAy[2]*3+lastAy[3]) * 0.125 * timeInterval * 3;
        lastVz += (lastAz[0]+lastAz[1]*3+lastAz[2]*3+lastAz[3]) * 0.125 * timeInterval * 3;
    }
    
    //add a fake force
    //(when acc is zero for a continuous time, we should assume that velocity is zero)
    if (accRef.x == 0) countX++; else countX = 0;
    if (accRef.y == 0) countY++; else countY = 0;
    if (accRef.z == 0) countZ++; else countZ = 0;
    if (countX == 10){
        countX = 0;
        lastVx = 0;
    }
    if (countY == 10){
        countY = 0;
        lastVy = 0;
    }
    if (countZ == 10){
        countZ = 0;
        lastVz = 0;
    }
    
    //get total V
    double vx = lastVx * 9.8, vy = lastVy * 9.8, vz = lastVz * 9.8;
    double lastV = sqrt(vx * vx + vy * vy + vz * vz);
    
    // Ok to log here as DDLog is thread-safe
    //    DDLogInfo( @"velocity:%.0f,%f", data.timestamp, lastV );
    if (distanceCount !=60) {
        distanceCount++;
        distance +=lastV*timeInterval;
        
    }else{
        
        if (longdistanceCount !=60) {
            longdistanceCount++;
            longdistance +=distance;
        }else{
            
        //DDLogInfo( @"longdistance for 1 min:%.0f,%f", data.timestamp, longdistance );
            longdistanceCount = 1;
            longdistance = 0;
        }
        
        NSArray* beaconLatAndLon = [self getBeaconLatAndLon];
        beacon_lat = [[beaconLatAndLon objectAtIndex:0] doubleValue];
        beacon_lon = [[beaconLatAndLon objectAtIndex:1] doubleValue];
        //DDLogInfo( @"distance for 1 s:%.0f,%f", data.timestamp, distance );
        DDLogInfo(@"lat:%f;lon:%f;heading:%f;distance:%f;beacon_lat:%f;beacon_lon:%f",lat,lon,heading,distance,beacon_lat,beacon_lon);
        NSLog(@"lat:%f;lon:%f;heading:%f;distance:%f;beacon_lat:%f;beacon_lon:%f",lat,lon,heading,distance,beacon_lat,beacon_lon);
        [self showEKFLocation];
        distanceCount =1;
        distance = 0;
        
    }
    
}

- (void)showEKFLocation{

    NSDictionary *dict = [[NSDictionary alloc] init];
    if (beacon_lat != 0.0)
    {
        dict = [NSMutableDictionary dictionaryWithObjectsAndKeys:[NSNumber numberWithDouble:beacon_lat],@"lat",[NSNumber numberWithDouble:beacon_lon],@"lon", [NSNumber numberWithDouble:heading],@"heading",nil];
    }else{
        
        dict = [NSMutableDictionary dictionaryWithObjectsAndKeys:[NSNumber numberWithDouble:lat],@"lat",[NSNumber numberWithDouble:lon],@"lon", [NSNumber numberWithDouble:heading],@"heading",nil];
    }
    NSData *jsonData  =[self toJSONData: dict];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSString *jsonDataString = [NSString stringWithFormat:@"show(%@)", jsonString];
    [self.myWebView stringByEvaluatingJavaScriptFromString:jsonDataString];
}

/*****************根据ibeacon位置来获取到室内定位算法*********************/

#pragma -mark 初始化beacon
- (void)initBeacon{
    //根据文件路径读取数据
    NSString *filePath = [[NSBundle mainBundle]pathForResource:@"yunzi"ofType:@"json"];
    NSData *jData = [NSData dataWithContentsOfFile:filePath options:NSDataReadingMappedIfSafe error:nil];
    NSMutableArray *mutableArray = [NSJSONSerialization JSONObjectWithData:jData options:NSJSONReadingMutableContainers error:nil];
    
//    NSLog(@"jsonObject:%@",mutableArray);
    beaconNo = mutableArray.count;
    //存放所有beacon的链表
    self.beaconList = [[NSMutableArray alloc] init];
    for (int i = 0;i < beaconNo; i++) {
        C3Beacon *c3beacon = [[C3Beacon alloc] init];
        c3beacon.X = [mutableArray[i] objectForKey:@"lat"];
        c3beacon.Y = [mutableArray[i] objectForKey:@"lon"];
        c3beacon.major = [mutableArray[i] objectForKey:@"major"];
        c3beacon.minor = [mutableArray[i] objectForKey:@"minor"];
        c3beacon.aveRssi = [NSNumber numberWithDouble:0.0];
        c3beacon.distance = [NSNumber numberWithDouble:0.0];
        c3beacon.effcount = [NSNumber numberWithInt:0];
        c3beacon.measuredPower = [NSNumber numberWithInt:59];
        c3beacon.rssiChain = [[NSMutableArray alloc] init];
        
        [self.beaconList addObject:c3beacon];
    }

}

#pragma -mark 获取室内环境下的经纬度
- (NSArray *)getBeaconLatAndLon{

    //检测到的beacon数组
    NSMutableArray *dictArr = [NSMutableArray array];
    for (int i = 0; i < self.detectedBeacons.count; i++) {
        CLBeacon *beacon = self.detectedBeacons[i];
        
        NSString *rssiString = [NSString stringWithFormat:@"%ld", labs(beacon.rssi)];
        NSDictionary *dict = [NSMutableDictionary dictionaryWithObjectsAndKeys:[NSNumber numberWithInt:[beacon.minor intValue]],@"minor",[NSNumber numberWithInt:[beacon.major intValue]],@"major", [NSNumber numberWithInt:[rssiString intValue]] ,@"rssi",[NSNumber numberWithInt:59],@"measuredPower",nil];
        [dictArr addObject:dict];
    }
    
    NSData *jsonData  =[self toJSONData: dictArr];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSLog(@"%@",jsonString);
//    NSLog(@"接收到的所有ibeacon的个数：%ld",dictArr.count);
    
    //向ibeaconList地图的每个ibeacon对象存入信号强度数组，数组元素最多为5个，数组作为一个链表，是动态更新的，保持最大为5个，没人检测到的ibeaconList中的ibeacon对象存入信号强度0
    for (int i = 0; i < beaconNo; i++) {
        bool hasData = false;
        C3Beacon *c3beacon = [[C3Beacon alloc] init];
        c3beacon = self.beaconList[i];
        if (c3beacon.rssiChain.count == 5) {
            [c3beacon.rssiChain removeObjectAtIndex:0];
        }
        int j;
        
        for ( j = 0; j < dictArr.count; j++) {
            if ( [c3beacon.minor isEqualToNumber:[dictArr[j] objectForKey:@"minor"]] && [c3beacon.major isEqualToNumber: [dictArr[j] objectForKey:@"major"]]) {
                hasData = true;
                break;
            }
        }
        if (hasData) {
            [c3beacon.rssiChain addObject:[dictArr[j] objectForKey:@"rssi"]];
            c3beacon.measuredPower = [dictArr[j] objectForKey:@"measuredPower"];
        }else{
            [c3beacon.rssiChain addObject:[NSNumber numberWithInt:0]];
        }
    }
    
    //求对beaconList的每个ibeacon求相对自己的距离，根据反距离加权算法得到自己的X和Y值
    double tmpX = 0.0;
    double tmpY = 0.0;
    double tmpD = 0.0;
    for (int k = 0;k < beaconNo ;k++) {
        C3Beacon *c3beacon = [[C3Beacon alloc] init];
        c3beacon = self.beaconList[k];

        if ([c3beacon.distance doubleValue] != 0.0 && [c3beacon.effcount intValue] >= 3) {
            tmpX = tmpX + [c3beacon.X doubleValue] / ([c3beacon.distance doubleValue]*[c3beacon.distance doubleValue]);
            tmpY = tmpY + [c3beacon.Y doubleValue] / ([c3beacon.distance doubleValue]*[c3beacon.distance doubleValue]);
            tmpD = tmpD + 1 / ([c3beacon.distance doubleValue] * [c3beacon.distance doubleValue]);
        }
    }
    if (tmpD !=0.0) {
        tmpX = tmpX / tmpD;
        tmpY = tmpY / tmpD;
        beacon_lat = tmpX;
        beacon_lon = tmpY;
        NSLog(@"当前位置,beacon_lat:%f;beacon_lon:%f",beacon_lat,beacon_lon);
        
    }
    NSArray* beaconLatAndLon = @[[NSNumber numberWithDouble:beacon_lat],[NSNumber numberWithDouble:beacon_lon]];
    return beaconLatAndLon;

}


@end
