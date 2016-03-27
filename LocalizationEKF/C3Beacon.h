//
//  C3Beacon.h
//  LocalizationEKF
//
//  Created by zhao on 16/3/27.
//  Copyright © 2016年 zhao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface C3Beacon : NSObject
@property(nonatomic,strong)NSNumber *X;
@property(nonatomic,strong)NSNumber *Y;
@property(nonatomic,strong)NSNumber *major;
@property(nonatomic,strong)NSNumber *minor;
@property(nonatomic,strong)NSNumber *aveRssi;
@property(nonatomic,strong)NSNumber *distance;
@property(nonatomic,strong)NSNumber *measuredPower;
@property(nonatomic,strong)NSNumber *effcount;
@property(nonatomic,strong)NSMutableArray *rssiChain;

@end
