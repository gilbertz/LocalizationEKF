  var positionCurrent = {
    lat: null,
    lng: null,
    hng: null
  };

  var lasthng = 0;
  var rotateangle=0;

var url='http://192.168.1.150:8399/arcgis/rest/services/noblelit/MapServer';

/**目标所在位置图片**/
var image =  new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        src: 'img/geolocation_marker_heading.png'
    }));

var beacon_image = new ol.style.Circle({
  radius: 3,
  fill: new ol.style.Fill({
    color: 'red'
  })
});

var styles = {
  /*'Point': new ol.style.Style({
    image: image
  }),*/
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#baf100',
      width: 5
    })
  }),
  'MultiLineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#39a67f',
      width: 5
    })
  }),
  'Circle': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};

var styleFunction = function(feature) {
  return styles[feature.getGeometry().getType()];
};

var beacon_array = [];
var beacon_poi_array = [];
$.getJSON("yunzi.json",function(data){
          var beacondata = eval(data);
          beaconNo = beacondata.length;
          
          for(var i=0;i<beaconNo;i++){
                    beacon_poi_array[0] = beacondata[i].lon;
                    beacon_poi_array[1] = beacondata[i].lat;
                    beacon_array[i]= ol.proj.fromLonLat(beacon_poi_array);
              
          }
          
          });

var beaconpoint = new ol.Feature({
                               geometry: new ol.geom.MultiPoint(beacon_array)
                               });

var beaconpoint_style = new ol.style.Style({
                                         image: beacon_image
                                         });

beaconpoint.setStyle(beaconpoint_style);

var current_poi_array = [];
current_poi_array[0] = 121.4366617310828;
current_poi_array[1] = 31.02737409901093;
var current_poi = ol.proj.fromLonLat(current_poi_array);

/*！！！！！！！！！！！！当前位置current_poi_marker实时显示的Ajax设置初始！定义的结束位置，函数在下面！！！！！！！！！！！！*/

var current_poi_marker = new ol.Feature({
  geometry: new ol.geom.Point(current_poi)
});

var current_poi_marker_style = new ol.style.Style({
  image: image
});

//current_poi_marker.setStyle(current_poi_marker_style);
current_poi_marker.setStyle(null);   /*这边原来是上面的代码，后来为了后来显示不会先出现一个点不显示它所以把它的style先禁用了*/


/*前面都是对于features的一些定义，下面到结束位置是矢量图层的source设置和layer设置*/


var vectorSource = new ol.source.Vector({
  /*features: (new ol.format.GeoJSON()).readFeatures(routeResult)*/
});

/*!!!这边有必要把当前位置的显示和路径规划的结果分离开来！！！*/
vectorSource.addFeatures([current_poi_marker]);

vectorSource.addFeatures([beaconpoint]);


var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: styleFunction,
  setZIndex: 99999
});


/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！Create the map的开始位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
/*前思后想我还是把初始化地图的中心center变量与current_poi关联了起来，
其实是没有什么区别，但是增加了数据风险，为的是这样的合理性即当前地图的视图应该以当前位置为中心*/
//var center = ol.proj.fromLonLat([120.7772719,31.5896528]);
var center = current_poi;

var map =  new ol.Map(
  {
    target: 'map',
    layers: [
      new ol.layer.Tile(
        {
          preload: Infinity,
          source: new ol.source.OSM()
        }
      ),
      //vectorLayer, /*这边添加了显示当前位置和路径的矢量图层*/
//      new ol.layer.Tile(
//        {
//        extent: [-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892],
//          //preload: Infinity,
//          source: new ol.source.TileArcGISRest(
//          {
//          url: url
//          }
//        )
//      }
//      ),
      vectorLayer,  /*这个是当前位置显示和全局路径规划的业务图层*/
    ],
    //北纬，东经是我们一般说的，但是这边程序一般是lonlat即经度在前120在前
    view: new ol.View({
        center: center,
        zoom: 17
      }),
    interactions: ol.interaction.defaults().extend([
      new ol.interaction.DragRotateAndZoom()
    ]),
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }).extend([
      new ol.control.FullScreen(),
      new ol.control.OverviewMap(),
      new ol.control.ZoomToExtent({
        extent: [
          13443862.1761606447,3710187.0677269883,
          13446056.1577381417,3709153.9735165713
        ]
      })
    ])
  }
);

map.addControl(new ol.control.ScaleLine());
/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！Create the map的结束位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/

function draw(){
      (beaconpoint.getGeometry()).setCoordinates(beacon_array);
      beaconpoint.setStyle(beaconpoint_style);
      map.render();
}


function show(jsondata){
    console.log("数据为："+JSON.stringify(jsondata));
    current_poi_array[0] = jsondata.lon;
    current_poi_array[1] = jsondata.lat;
    current_poi = ol.proj.fromLonLat(current_poi_array);
    (current_poi_marker.getGeometry()).setCoordinates(current_poi);
    current_poi_marker.setStyle(current_poi_marker_style);
    // image.setRotation(jsondata.heading);
    map.render();
    draw();
};

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", onHeadingChange);
  }

  function getBrowserOrientation() {
    var orientation;
    if (screen.orientation && screen.orientation.type) {
      orientation = screen.orientation.type;
    } else {
      orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    }
    return orientation;
  }

  function onHeadingChange(event) {
    var heading = event.alpha;

    if (typeof event.webkitCompassHeading !== "undefined") {
      heading = event.webkitCompassHeading; 
    };

    positionCurrent.hng = heading;

      if (positionCurrent.hng <= 15 || positionCurrent.hng > 345) {
        lasthng = 0;
      } else if (positionCurrent.hng <= 45 && positionCurrent.hng > 15) {
        lasthng = 30;
      } else if (positionCurrent.hng <= 75 && positionCurrent.hng > 45) {
        lasthng = 60;
      } else if (positionCurrent.hng <= 105 && positionCurrent.hng > 75) {
        lasthng = 90;
      } else if (positionCurrent.hng <= 135 && positionCurrent.hng > 105) {
        lasthng = 120;
      } else if (positionCurrent.hng <= 165 && positionCurrent.hng > 135) {
        lasthng = 150;
      } else if (positionCurrent.hng <= 195 && positionCurrent.hng > 165) {
        lasthng = 180;
      } else if (positionCurrent.hng <= 225 && positionCurrent.hng > 195) {
        lasthng = 210;
      } else if (positionCurrent.hng <= 255 && positionCurrent.hng > 225) {
        lasthng = 240;
      } else if (positionCurrent.hng <= 285 && positionCurrent.hng > 255) {
        lasthng = 270;
      } else if (positionCurrent.hng <= 315 && positionCurrent.hng > 285) {
        lasthng = 300;
      } else {
        lasthng = 330;
      }
    //针对ipad进行航向角修正
    rotateangle=lasthng+90;
    image.setRotation(rotateangle);
    console.log("rotateangle:"+rotateangle);
  }