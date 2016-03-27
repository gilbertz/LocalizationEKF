//
//  C3Beacon.m
//  LocalizationEKF
//
//  Created by zhao on 16/3/27.
//  Copyright © 2016年 zhao. All rights reserved.
//

#import "C3Beacon.h"

@implementation C3Beacon

//有效的rssi个数
- (NSNumber*)effcount{
    int effcount = 0;
    for (int j = 0; j < self.rssiChain.count; j++)
    {
        if ([self.rssiChain[j] intValue]!= 0)
        {
            effcount++;
        }
    }
    _effcount = [NSNumber numberWithInt:effcount];
    return _effcount;
}

//求平均rssi
- (NSNumber*)aveRssi{
    int num=0;
    int effcount=0;
    for(int i=0;i<self.rssiChain.count;i++)
    {
        if([self.rssiChain[i] intValue]!=0)
        {
            num=num+[self.rssiChain[i] intValue];
            effcount++;
        }
    }
    if(effcount!=0)
    {
        _aveRssi=[NSNumber numberWithInt:num/effcount];
    }
    else
    {
        _aveRssi=[NSNumber numberWithInt:0];
    }
    
    return _aveRssi;
}

//wizarcan的rssi和距离的换算公式
- (NSNumber*)distance{
    double ratio = [self.aveRssi intValue] / [self.measuredPower intValue];
    int cor = pow([self.aveRssi intValue], 3.0);
    double Correction = 0.96 + cor % 10 / 150.0;
    if (ratio < 1)
    {
        _distance = [NSNumber numberWithDouble:pow(ratio, 9.98) * Correction];
    }
    else
    {
        _distance = [NSNumber numberWithDouble:0.103 + 0.89978 * pow(ratio, 9) * Correction];
    }
    return _distance;
};


@end
