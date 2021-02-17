
function LongdomapLegend(obj) {
    var self = this;
    var map = obj.map;

    var legend_div_id = 'longdomap-legend-div';
    var legend_title_id = 'longdomap-legend-collapse-title';
    var legend_content_div_id = 'longdomap-legend-content-div';
    var collapse_div_id = 'longdomap-legend-collapse-div';

    var map_div_id = map.placeholder().parentNode.getAttribute('id');
    
    this.showMapLegend = function (title, content) {
        var map_div = document.getElementsByClassName("ldmap_placeholder")[0];
        if(!map_div || typeof(map_div) != 'object') return;
        
        var legenddiv = document.getElementById(legend_div_id);
    
        if (legenddiv) {
            document.getElementById(legend_div_id).innerHTML = content;
            if (legenddiv.style.display == 'none') {
                legenddiv.style.display = 'block';
            }
            document.getElementById(_legend_title_id).innerHTML = title;
        } else {
            legenddiv = document.createElement("div");
            legenddiv.id = legend_div_id;
            legenddiv.innerHTML = '<div id="'+collapse_div_id+'"><div class="longdomap-legend-collapse-button"><!--div class="collapse-arrow"></div><div id="'+self._collapse_div_text_id+'">'+self._legend_hidden_text+'</div--></div><div id="'+legend_title_id+'" class="float-left">'+title+'</div><div class="clear" style="clear:both"></div></div><div id="'+legend_content_div_id+'">'+content+'</div>';

            map_div.appendChild(legenddiv);
        }

        self.resizeMapLegend();
        
        var content = document.getElementById(legend_div_id);
        var content_img = content.getElementsByTagName('img');
        var num_img = content_img.length;
        var each_img;
        for(var i=0; i<num_img; i++) {
            each_img = content_img[i];
            if (typeof(each_img) != 'object') {
                continue;
            }
            //each_img.map_div = map_div;
            //each_img.onload = function() { resizeMapLegend(self.map_div); };
            each_img.onload = function() { self.resizeMapLegend(); };
        }
    }

    this.hideMapLegend = function() {
        var legenddiv = document.getElementById(legend_div_id);
        if (legenddiv) {
            legenddiv.style.display = 'none';
        }
    }

    this.resizeMapLegend = function() {
        var map_div = document.getElementById(map_div_id);
        var legend = document.getElementById(legend_div_id);
        if (!legend) {
            return;
        }
            
        var content = document.getElementById(legend_content_div_id);
        var collapse = document.getElementById(collapse_div_id);
        
        content.style.height = '';
        content.style.width = '';
        content.style.overflowX = '';
        
        var map_area_size = self.getElementSize(map_div);
        var content_size_h = self.getElementSize(content, 'h');
        var collapse_h = self.getElementSize(collapse, 'h');
        
        var legend_padding_h = 10;
        var legend_padding_w = 20;
        var padding_for_map_h = 90; // toolbar area
        var padding_for_map_w = 60; // toolbar area

        var legend_margin_w;

        if(!legend_margin_w) {
            legend_margin_w = 20;
        }
        
        var fit_h = map_area_size.h - padding_for_map_h - collapse_h - legend_padding_h - 80; // bottom: 80
        var fit_w = map_area_size.w - padding_for_map_w - legend_padding_w - legend_margin_w;
        
        var content_size_w;
        if (content_size_h > fit_h) {
            content.style.height = fit_h + 'px';
            content_size_w = self.getElementSize(content, 'w');
            content.style.width = (content_size_w + 30) + 'px'; // 20: scrollbar width
        }
        
        content_size_w = self.getElementSize(content, 'w');
        if (content_size_w > fit_w) {
            content.style.width = fit_w + 'px';
            content.style.overflowX = 'auto';
        }
    }

    this.getElementSize = function (ele, op) {
        if (typeof(ele) == 'string') {
            let elements = document.body.querySelectorAll(ele);
            ele = elements[0];
        }
            
        if (typeof(ele) == 'object') {
            if (ele == window) {
                return {w:(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0), h:(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0)};
            }
            let size_obj = {w:ele.clientWidth, h:ele.clientHeight, w_size:self.getDimensions(ele).width, h_size:self.getDimensions(ele).height};
            
            if (op) {
                if (op == 'h') {
                    return size_obj.h;
                } else if (op == 'w') {
                    return size_obj.w;
                }
            }
            return size_obj;
        }
        return {w:0, h:0, w_size:0, h_size:0};
    }

    this.getDimensions = function(element) {
        var display = element.style.display;
        if (display != 'none' && display != null) // Safari bug
          return {width: element.offsetWidth, height: element.offsetHeight};
    
        // All *Width and *Height properties give 0 on elements with display none,
        // so enable the element temporarily
        var els = element.style;
        var originalVisibility = els.visibility;
        var originalPosition = els.position;
        var originalDisplay = els.display;
        els.visibility = 'hidden';
        els.position = 'absolute';
        els.display = 'block';
        var originalWidth = element.clientWidth;
        var originalHeight = element.clientHeight;
        els.display = originalDisplay;
        els.position = originalPosition;
        els.visibility = originalVisibility;
        return {width: originalWidth, height: originalHeight};
    }
}