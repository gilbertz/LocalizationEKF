//var url = 'http://localhost:8399/arcgis/rest/services/UMR/sjtu_east/MapServer';
//var url = 'http://localhost:8399/arcgis/rest/services/HD-MAP-DATA/HD-MAP-DATA_Changshu_challenge_map/MapServer';
var url='http://192.168.1.150:8399/arcgis/rest/services/noblelit/MapServer';

/*！！！！！！！！！！！！！！百度搜索框云圆装x，添加alert事件：当前网络异常，请稍后再试的开始位置！！！！！！！！！！！！！！！！！！！！！！！！*/
$('#search-button').click(function() {
  alert('当前网络异常，请稍后再试＞﹏＜');
});
/*以后搭了后台，有了路点数据库再做吧*/
/*！！！！！！！！！！！！！！百度搜索框云圆装x，添加alert事件：当前网络异常，请稍后再试的结束位置！！！！！！！！！！！！！！！！！！！！！！！！*/

/*！！！！！！！！！！！！！！！！！！！！！！！！！！ratyli反馈评论的开始位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
$(function() {
  var likeCount = [];
  var customer_number = 0;
  $(function() {
    $('#feedback').click(function() {
      if($('#demo5').is(':visible')) {
        $('#demo5').fadeOut(1000);
      }else {
        $('#demo5').fadeIn(1000);
      }
    });
  });
  /*$('#demo5').hide();*/
  $(function() {
    // Font Awesome Signs
    $('#demo5 .ratyli').ratyli({
      full:"<i class='fa fa-thumbs-up'></i>",
      empty:"<i class='fa fa-thumbs-o-up'></i>",
      onRated:function(value,init){
        // rating callback
        if(!init) {
          likeCount[customer_number] = value;
          console.log('第'+(customer_number+1) +'位旅客的打分为'+likeCount[customer_number]+'分');
          customer_number++;
          /*        alert(value);*/
          $('#demo5').fadeOut(2000);
        }  // prevent run at init
      }

    });
  });
});

/*！！！！！！！！！！！！！！！！！！！！！！！！！！ratyli反馈评论的结束位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/




/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！MousePosion的开始位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(3),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
});

/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！MousePosion的结束位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/



/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！currentPos和全局路径规划结果显示开始位置！！！！！！！！！！！！！！！！！！！！！！！*/
var image = new ol.style.Circle({
  radius: 7,
  fill: new ol.style.Fill({
    color: 'skyblue'
  }),
  stroke: new ol.style.Stroke({color: 'white', width: 2})
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



/*！！！！！！！！！！！！route_plan_result的开始位置！！！！！！！！！！！！*/
var route_plan_result= [ [120.7836932,31.5907223],
      [120.7832633,31.5910919],
      [120.7826518,31.5916219],
      [120.7822433,31.5918823],
      [120.7822289,31.5918833],
      [120.7820661,31.5917567],
      [120.7819633,31.5917389],
      [120.7818683,31.5917833],
      [120.7818433,31.5918806],
      [120.7816477,31.5919400],
      [120.7816233,31.5920407],
      [120.7817090,31.5922374],
      [120.7817109,31.5922939],
      [120.7817268,31.5923335],
      [120.7816499,31.5924409],
      [120.7815572,31.5925085],
      [120.7814752,31.5925707],
      [120.7814452,31.5925926],
      [120.7804580,31.5933202],
      [120.7803771,31.5933613],
      [120.7801338,31.5935290],
      [120.7800796,31.5935650],
      [120.7800139,31.5936164],
      [120.7799068,31.5936307],
      [120.7798212,31.5936007],
      [120.7797312,31.5935579],
      [120.7796755,31.5935312],
      [120.7796316,31.5935087],
      [120.7793652,31.5933722],
      [120.7784539,31.5929144],
      [120.7780531,31.5927055],
      [120.7779552,31.5926899],
      [120.7778824,31.5926497],
      [120.7777741,31.5926580],
      [120.7776944,31.5927270],
      [120.7776440,31.5927841],
      [120.7775703,31.5928198],
      [120.7772462,31.5931853],
      [120.7771898,31.5932453],
      [120.7769086,31.5935658],
      [120.7767831,31.5936478],
      [120.7767260,31.5937180],
      [120.7766367,31.5937799],
      [120.7765725,31.5938061],
      [120.7764809,31.5938192],
      [120.7763881,31.5937930],
      [120.7763077,31.5937521],
      [120.7762481,31.5937277],
      [120.7749685,31.5931721],
      [120.7748529,31.5931210],
      [120.7743717,31.5929126],
      [120.7743160,31.5928884],
      [120.7741524,31.5928174],
      [120.7734879,31.5925299],
      [120.7732755,31.5924392],
      [120.7731975,31.5924141],
      [120.7731830,31.5924593],
      [120.7729865,31.5924320],
      [120.7729075,31.5923328],
      [120.7729231,31.5922987],
      [120.7729079,31.5922917],
      [120.7725334,31.5921285],
      [120.7723751,31.5920203],
      [120.7723787,31.5920131],
      [120.7724001,31.5919703],
      [120.7725798,31.5920310],
      [120.7727082,31.5920870],
      [120.7735183,31.5924297],
      [120.7743261,31.5927759],
      [120.7744417,31.5927898],
      [120.7745511,31.5928436],
      [120.7746261,31.5928555],
      [120.7746951,31.5928281],
      [120.7747586,31.5927455],
      [120.7747979,31.5927001],
      [120.7750078,31.5924383],
      [120.7753966,31.5919644],
      [120.7754970,31.5918682],
      [120.7756060,31.5917288],
      [120.7756224,31.5916519],
      [120.7758522,31.5913793],
      [120.7758891,31.5913333],
      [120.7761052,31.5910649],
      [120.7765773,31.5904834],
      [120.7767091,31.5903501],
      [120.7768576,31.5901679],
      [120.7768645,31.5901001],
      [120.7770915,31.5898317],
      [120.7771300,31.5897813],
      [120.7773762,31.5894757],
      [120.7780490,31.5886448],
      [120.7781397,31.5885635],
      [120.7783039,31.5883597],
      [120.7783135,31.5882912],
      [120.7783464,31.5882393],
      [120.7783452,31.5881810],
      [120.7782679,31.5881270],
      [120.7782164,31.5880618],
      [120.7778081,31.5878434],
      [120.7776804,31.5877769],
      [120.7776250,31.5878833] ];

for(var i=0;i<route_plan_result.length;i++) {
  route_plan_result[i] = ol.proj.fromLonLat(route_plan_result[i]);
}

var routeResult = new ol.Feature({
  geometry: new ol.geom.LineString(route_plan_result)
});

var routeResult_style = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#baf100',
    width: 5
  })
});
/*routeResult.setStyle(routeResult_style);*/

/*！！！！！！！！！！！！route_plan_result的结束位置！！！！！！！！！！！！*/

/*！！！！！！！！！！！！添加任务点taskpoint的开始位置！！！！！！！！！！！！*/
var taskpoint_array = [ [120.7836932,31.5907223],
    [120.7833172,31.5910728],
    [120.7818862,31.5922510],
    [120.7814473,31.5925955],
    [120.7801275,31.5935336],
    [120.7796232,31.5935250],
    [120.7779631,31.5926882],
    [120.7776448,31.5927829],
    [120.7767862,31.5936523],
    [120.7763094,31.5937866],
    [120.7748375,31.5931481],
    [120.7741318,31.5928648],
    [120.7734688,31.5925747],
    [120.7731830,31.5924593],
    [120.7729865,31.5924320],
    [120.7729075,31.5923328],
    [120.7723820,31.5920148],
    [120.7726990,31.5921082],
    [120.7744439,31.5927963],
    [120.7776250,31.5878833] ];


for(var i=0;i<taskpoint_array.length;i++) {
    taskpoint_array[i] = ol.proj.fromLonLat(taskpoint_array[i]);
}

var taskpoint = new ol.Feature({
    geometry: new ol.geom.MultiPoint(taskpoint_array)
});

var taskpoint_style = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/taskpoint.png'
    }))
});

taskpoint.setStyle(taskpoint_style);

/*！！！！！！！！！！！！添加任务点taskpoint的结束位置！！！！！！！！！！！！*/


/*！！！！！！！！！！！！添加StartMarker和endMarker的开始位置！！！！！！！！！！！！*/

var startMarker = new ol.Feature({
    geometry: new ol.geom.Point(route_plan_result[0])
});

var endMarker = new ol.Feature({
    geometry: new ol.geom.Point(route_plan_result[route_plan_result.length - 1])
});

var startMarker_style = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/startMarker.png'
    }))
});

var endMarker_style = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'img/endMarker.png'
    }))
});

startMarker.setStyle(startMarker_style);

endMarker.setStyle(endMarker_style);



/*！！！！！！！！！！！！添加StartMarker和endMarker的结束位置！！！！！！！！！！！！*/

/*！！！！！！！！！！！！当前位置current_poi_marker实时显示的Ajax设置初始！定义的开始位置，函数在下面！！！！！！！！！！！！*/

var current_poi_array = [];
current_poi_array[0] = 120.7771300;
current_poi_array[1] = 31.5897813;
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

vectorSource.addFeatures([taskpoint, startMarker, endMarker]); /*新建的设置好的feature，需要在这边添加到source里面*/

/*!!!这边有必要把当前位置的显示和路径规划的结果分离开来！！！*/
vectorSource.addFeatures([current_poi_marker]);

/*添加routeResult的feature*/
vectorSource.addFeatures([routeResult]);



var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: styleFunction,
  setZIndex: 99999
});

/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！currentPos和全局路径规划结果显示结束位置！！！！！！！！！！！！！！！！！！！！！！！！*/




/*！！！！！！！！！！！！！！！！！！！！！！！！！！Pen绘制地图要素图层的开始位置_Part 1！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/

var vector = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#00c5ff',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#fe5845'
      }),
      stroke: new ol.style.Stroke({color: 'white', width: 2})
    })
  })

});


/*！！！！！！！！！！！！！！！！！！！！！！！！！！Pen绘制地图要素图层的结束位置_Part 1！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/



/*！！！！！！！！！！！！！！！！！！！！！！！！！！Measure测量函数图层的开始位置_Part 1！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
var source = new ol.source.Vector();

var vector_measure = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});



/*！！！！！！！！！！！！！！！！！！！！！！！！！！Measure测量函数图层的结束位置_Part 1！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/




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
      new ol.layer.Tile(
        {
        extent: [-20037508.3427892,-20037508.3427892,20037508.3427892,20037508.3427892],
          //preload: Infinity,
          source: new ol.source.TileArcGISRest(
          {
          url: url
          }
        )
      }
      ),
      vectorLayer,  /*这个是当前位置显示和全局路径规划的业务图层*/
      vector,   /*这个是Pen绘制的图层*/
      vector_measure   /*这个是测量工具的图层*/
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
      mousePositionControl,
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



/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！当前位置实时获取显示的函数开始位置！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
/*！！！初始化不显示位置的开始位置！！！*/
$(function() {
  $('#currentPos').trigger('click');
  $('#currentPos').trigger('click');
});
/*！！！初始化不显示位置的结束位置！！！*/

var animating = false;
var laozirangni_stop = true;

function showCurrentPoi() {
  if (animating) {
    stopshowCurrentPoi();
  } else {
    animating = true;
    laozirangni_stop = true;
    // just in case you pan somewhere else
    map.getView().setCenter(current_poi);   /*这边改了，把以前的center改成了这边的current_poi，感觉这样更合理一点*/
    map.on('postcompose', moveFeature);
    map.render();
  }
}

var moveFeature = function() {
  if (animating) {
    function getResult() {
      if(laozirangni_stop) {
        current_poi_marker.setStyle(current_poi_marker_style);   /*!!!这里是重新显示marker！！！*/

        var xmlHttpReq = null;
        /*声明一个空对象来装入XMLHttpRequest对象*/
        if ( window.ActiveXObject ) { /*IE 5 IE 6是以ActiveXObject的方式引入XMLHttpRequest对象的*/
          xmlHttpReq = new ActiveXObject ('Microsoft.XMLHTTP');
        } else if (window. XMLHttpRequest) { /*除了IE5，IE6以外的浏览器，XMLHttpRequest是window的子对象*/
          xmlHttpReq = new XMLHttpRequest ();
          /*s实例化一个XMLHttpRequest对象*/
        }
        xmlHttpReq.open( 'GET', 'data/currentPos.txt' , true);
        /*调用open()方法并!!!采用异步方式*/
        xmlHttpReq.onreadystatechange = RequestCallBack;
        /*设置回调函数*/
        xmlHttpReq.send(null);
        /*因为使用GET方法提交，所以可以使用null作为参数调用*/
        function RequestCallBack () { /*一旦readystate的值改变，就会调用这个函数*/
          if ( xmlHttpReq.readyState == 4) {
            if ( xmlHttpReq.status == 200) {
              current_poi_array[0] = JSON.parse(xmlHttpReq .responseText)[0];
              current_poi_array[1] = JSON.parse(xmlHttpReq .responseText)[1];
              current_poi = ol.proj.fromLonLat(current_poi_array);

              (current_poi_marker.getGeometry()).setCoordinates(current_poi);
            }
          }
        }
      }
    }
    var timer = null;
    timer = setInterval( getResult,2000 );

  }
  // tell OL3 to continue the postcompose animation
  map.render();
};


/*停止当前位置的显示的函数*/
function stopshowCurrentPoi() {
  animating = false;
  laozirangni_stop = false;
  current_poi_marker.setStyle(null);
  //remove listener
  map.un('postcompose', moveFeature);
}

$('#currentPos' ).bind('click', showCurrentPoi);

/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！当前位置实时获取显示的函数结束位置！！！！！！！！！！！！！！！！！！！！！！！！！！！*/



/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！显示全局路径规划的函数的开始位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
$(function() {
  var switch_value = true;
  var route_plan_result_length = Math.round(routeResult.getGeometry().getLength() * 100) / 100/1000;
  $('#routeBtn').click(function() {
    if(switch_value) {
      taskpoint.setStyle(null);
      startMarker.setStyle(null);
      endMarker.setStyle(null);
      (routeResult.getGeometry()).setCoordinates([]);
      switch_value = false;
    }else {
      taskpoint.setStyle(taskpoint_style);
      startMarker.setStyle(startMarker_style);
      endMarker.setStyle(endMarker_style);
/*      (taskpoint.getGeometry()).setCoordinates(taskpoint_array);*/
      (routeResult.getGeometry()).setCoordinates(route_plan_result);
      switch_value = true;
      toastr.options.closeButton = true;
      toastr.options.positionClass = 'toast-bottom-right';
      toastr.success(''+route_plan_result_length+' km','全程', {timeOut: 8000});
    }
  });
  $('#routeBtn').trigger('click');
});

/*！！！！！！！！！！！！！！！！！！！！！！！！！！！！显示全局路径规划的函数的结束位置！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/



/*！！！！！！！！！！！！！！！！！！！！！！！！！！Pen绘制地图要素图层的开始位置_Part 2！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/

var Modify = {
  init: function() {
    this.select = new ol.interaction.Select();
    map.addInteraction(this.select);

    this.modify = new ol.interaction.Modify({
      features: this.select.getFeatures()
    });
    map.addInteraction(this.modify);

    this.setEvents();
  },
  setEvents: function() {
    var selectedFeatures = this.select.getFeatures();

    this.select.on('change:active', function() {
      selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
    });
  },
  setActive: function(active) {
    this.select.setActive(active);
    this.modify.setActive(active);
  }
};
Modify.init();

var optionsForm = document.getElementById('options-form');

var Draw = {
  init: function() {
    map.addInteraction(this.Point);
    this.Point.setActive(false);
    map.addInteraction(this.LineString);
    this.LineString.setActive(false);
    map.addInteraction(this.Polygon);
    this.Polygon.setActive(false);
  },
  Point: new ol.interaction.Draw({
    source: vector.getSource(),
    type: /** @type {ol.geom.GeometryType} */ ('Point')
  }),
  LineString: new ol.interaction.Draw({
    source: vector.getSource(),
    type: /** @type {ol.geom.GeometryType} */ ('LineString')
  }),
  Polygon: new ol.interaction.Draw({
    source: vector.getSource(),
    type: /** @type {ol.geom.GeometryType} */ ('Polygon')
  }),
  getActive: function() {
    return this.activeType ? this[this.activeType].getActive() : false;
  },
  setActive: function(active) {
    var type = optionsForm.elements['draw-type'].value;
    if (active) {
      this.activeType && this[this.activeType].setActive(false);
      this[type].setActive(true);
      this.activeType = type;
    } else {
      this.activeType && this[this.activeType].setActive(false);
      this.activeType = null;
    }
  }
};
Draw.init();


/**
 * Let user change the geometry type.
 * @param {Event} e Change event.
 */
optionsForm.onchange = function(e) {
  var type = e.target.getAttribute('name');
  var value = e.target.value;
  if (type == 'draw-type') {
    Draw.getActive() && Draw.setActive(true);
  } else if (type == 'interaction') {
    if (value == 'modify') {
      Draw.setActive(false);
      Modify.setActive(true);
    } else if (value == 'draw') {
      Draw.setActive(true);
      Modify.setActive(false);
    }
  }
};

/*!!!Pen的初始化设置的开始位置!!!*/

/*$('#options-form').hide();*/
Draw.setActive(false);
Modify.setActive(false);

$('#pen').click(function() {
  if($('#options-form').is(':visible')) {
    Draw.setActive(false);
    Modify.setActive(false);
    $('#options-form').fadeOut(2000);
  }else {
    Draw.setActive(true);
    Modify.setActive(false);
    $('#options-form').fadeIn(2000);
  }
});

/*!!!Pen的初始化设置的开始位置!!!*/

// The snap interaction must be added after the Modify and Draw interactions
// in order for its map browser event handlers to be fired first. Its handlers
// are responsible of doing the snapping.
var snap = new ol.interaction.Snap({
  source: vector.getSource()
});
map.addInteraction(snap);


/*！！！！！！！！！！！！！！！！！！！！！！！！！！Pen绘制地图要素图层的结束位置_Part 2！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/



/*！！！！！！！！！！！！！！！！！！！！！！！！！！Measure测量函数的开始位置_Part 2！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/
$(function() {
  var wgs84Sphere = new ol.Sphere(6378137);


  /**
   * Currently drawn feature.
   * @type {ol.Feature}
   */
  var sketch;


  /**
   * The help tooltip element.
   * @type {Element}
   */
  var helpTooltipElement;


  /**
   * Overlay to show the help messages.
   * @type {ol.Overlay}
   */
  var helpTooltip;


  /**
   * The measure tooltip element.
   * @type {Element}
   */
  var measureTooltipElement;


  /**
   * Overlay to show the measurement.
   * @type {ol.Overlay}
   */
  var measureTooltip;


  /**
   * Message to show when the user is drawing a polygon.
   * @type {string}
   */
  var continuePolygonMsg = 'Click to continue drawing the polygon';


  /**
   * Message to show when the user is drawing a line.
   * @type {string}
   */
  var continueLineMsg = 'Click to continue drawing the line';


  /**
   * Handle pointer move.
   * @param {ol.MapBrowserEvent} evt The event.
   */
  var pointerMoveHandler = function(evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    var helpMsg = 'Click to start drawing';

    if (sketch) {
      var geom = (sketch.getGeometry());
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    $(helpTooltipElement).removeClass('hidden');
  };



  map.on('pointermove', pointerMoveHandler);

  $(map.getViewport()).on('mouseout', function() {
    $(helpTooltipElement).addClass('hidden');
  });

  var typeSelect = document.getElementById('type');
  var geodesicCheckbox = document.getElementById('geodesic');

  var draw_m; // global so we can remove it later


  /**
   * Format length output.
   * @param {ol.geom.LineString} line The line.
   * @return {string} The formatted length.
   */
  var formatLength = function(line) {
    var length;
    if (geodesicCheckbox.checked) {
      var coordinates = line.getCoordinates();
      length = 0;
      var sourceProj = map.getView().getProjection();
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += wgs84Sphere.haversineDistance(c1, c2);
      }
    } else {
      length = Math.round(line.getLength() * 100) / 100;
    }
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
      ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
      ' ' + 'm';
    }
    return output;
  };


  /**
   * Format length output.
   * @param {ol.geom.Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  var formatArea = function(polygon) {
    var area;
    if (geodesicCheckbox.checked) {
      var sourceProj = map.getView().getProjection();
      var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
      var coordinates = geom.getLinearRing(0).getCoordinates();
      area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
    } else {
      area = polygon.getArea();
    }
    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
      ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
      ' ' + 'm<sup>2</sup>';
    }
    return output;
  };

  function addInteraction() {
    var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
    draw_m = new ol.interaction.Draw({
      source: source,
      type: /** @type {ol.geom.GeometryType} */ (type),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    });
    map.addInteraction(draw_m);

    createMeasureTooltip();
    createHelpTooltip();

    var listener;
    draw_m.on('drawstart',
      function(evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function(evt) {
          var geom = evt.target;
          var output;
          if (geom instanceof ol.geom.Polygon) {
            output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof ol.geom.LineString) {
            output = formatLength(/** @type {ol.geom.LineString} */ (geom));
            tooltipCoord = geom.getLastCoordinate();
          }
          measureTooltipElement.innerHTML = output;
          measureTooltip.setPosition(tooltipCoord);
        });
      }, this);

    draw_m.on('drawend',
      function() {
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
      }, this);
  }


  /**
   * Creates a new help tooltip
   */
  function createHelpTooltip() {
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
  }


  /**
   * Creates a new measure tooltip
   */
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
  }


  /**
   * Let user change the geometry type.
   */
  typeSelect.onchange = function() {
    map.removeInteraction(draw_m);
    addInteraction();
  };

  addInteraction();


  /*!!!Measure测量的初始化设置的开始位置!!!*/


  map.removeInteraction(draw_m);
  $('.tooltip').css('opacity',0);
  /*$('#measurechan').hide();*/
  $('#measure').click(function() {
    if($('#measurechan').is(':visible')) {
      map.removeInteraction(draw_m);
      $('.tooltip').css('opacity',0);
      $('#measurechan').fadeOut(2000);
    }else {
      map.addInteraction(draw_m);
      $('.tooltip').css('opacity',0.7);
      $('#measurechan').fadeIn(2000);
    }
  });

  /*!!!Measure测量的初始化设置的开始位置!!!*/

});



/*！！！！！！！！！！！！！！！！！！！！！！！！！！Measure测量函数的开始位置_Part 2！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！*/


