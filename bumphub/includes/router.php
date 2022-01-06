<?php
class Router {
    private $routes;
    private $params;
    private $default_route;
    private $route_name;
    private $full_route;
    private $not_found_route;
    private $access_denied_route;
    private $check_access_function;
    private $web_content_folder;
    private $alwaysLoadBaseLayout = false;
    
    function __construct() {
        $this->routes = array();
        $this->params = array();
        $this->default_route = "";
        $this->not_found_route = "not_found";
        $this->access_denied_route = "access_denied";
        $this->check_access_function = "";
        $this->web_content_folder = "";
    }
    
    function init() {
        if(isset($_GET["q1"])) {
            $_GET["q1"] = str_replace("-","_",$_GET["q1"]);
            $this->default_route = $_GET["q1"];
        } else {
            $_GET["q1"] = $this->default_route;
        }
        
        $this->params = array(
            (isset($_GET["q1"]) ? $_GET["q1"] : null),
            (isset($_GET["q2"]) ? $_GET["q2"] : null),
            (isset($_GET["q3"]) ? $_GET["q3"] : null),
            (isset($_GET["q4"]) ? $_GET["q4"] : null)
        );
        
        $this->route_name = $this->default_route;
        
        $this->full_route = implode("/",array_filter($this->params));
    }
    
    function run() {
        if(isset($this->routes[$this->route_name])) {
            // the route exists
            if(function_exists($this->check_access_function)) {
                // a function for checking permissions has been set so call it
                if(call_user_func($this->check_access_function, $this->routes[$this->route_name]["roles"])) {
                    // access granted, run the route's function
                    $this->callRoute($this->route_name);
                } else {
                    // access denied
                    $this->callAccessDeniedRoute();
                }
            } else {
                // access granted by default
                $this->callRoute($this->route_name);
            }
        } else {
            if($this->alwaysLoadBaseLayout) {
                $this->callRoute($this->route_name);
            } else {
                // the route is not found
                $this->callNotFoundRoute();
            }
        }
    }
    
    function loadAll() {
        if($handle = opendir($this->web_content_folder)) {
            while (false !== ($entry = readdir($handle))) {
                if(stripos($entry,".php") && stripos($entry,"_") !== 0) {
                    $this->set(str_replace(".php", "", $entry),null,null,array());
                }
            }
            closedir($handle);
        }
    }
    
    function renderView($route_name, $parameters) {
        //$pdf = filter_input(INPUT_GET, "pdf");
        
        if(!isset($GLOBALS["title"])) {
            // its global so that it can be changed within the template being loaded and if its already been set by the controller it won't be overrided here with the default route name
            $GLOBALS["title"] = Template::toTitleCase($route_name); // set the route_name as the default title - it can then be overriden from within the template via global $title;
        }
        $parameters["web_content_folder"] = $this->web_content_folder;
        $body = Template::load($this->web_content_folder."/$route_name.php",$parameters);
        
        $output = "";
        if(file_exists($this->web_content_folder."/layout/base_{$route_name}.php")) {
            $output = Template::load($this->web_content_folder."/layout/base_{$route_name}.php",  array_merge($parameters,array("route_name"=>$route_name,"body"=>$body,"params"=>$this->params)));
        } else {
            $output = Template::load($this->web_content_folder."/layout/base.php",  array_merge($parameters,array("route_name"=>$route_name,"body"=>$body,"params"=>$this->params)));
        }
        
        /*if($pdf !== null) {
            if(API_DEBUG_MODE) {
                include("libraries/MPDF60/mpdf.php");
            } else {
                include("libraries/MPDF57/mpdf.php");
            }
            
            //new mPDF($mode, $format, $font_size, $font, $margin_left, $margin_right, $margin_top, $margin_bottom, $margin_header, $margin_footer, $orientation);
            $mpdf=new mPDF('', 'A4'.($pdf == "landscape" ? "-L" : ""), null, null, 0, 0, 0, 0, 0, 0);
            //$mpdf=new mPDF('','A4'.($pdf == "landscape" ? "-L" : ""));
            //$mpdf->useSubstitutions = true; // optional - just as an example
            //$mpdf->SetHTMLHeader("<img src='webcontent/img/bg_1.png'/>");  // optional - just as an example
            //$mpdf->SetHTMLFooter("<img src='webcontent/img/ft_1.png'/>");  // optional - just as an example
            //$mpdf->CSSselectMedia='mpdf'; // assuming you used this in the document header
            //$mpdf->setBasePath($url);
            //$this->use_kwt = true;
            $mpdf->WriteHTML($output);
            $mpdf->Output($GLOBALS["title"]." - ".$GLOBALS["SiteName"].".pdf",'D');
            exit;
        } else {*/
            print $output;
        //}
    }
    
    function callRoute($route_name) {
        $parameters = array("params"=>$this->params);
        $controller = null;
        
        if(isset($this->routes[$route_name]) && class_exists($this->routes[$route_name]["controller"])) {
            $controller = new $this->routes[$route_name]["controller"]($route_name,  $this->routes[$route_name]["controller_arguments"]);
            $parameters = $controller->run($this->params);
        }
        
        if($parameters === false) {
            // the route has requested that the not_found view be rendered
            $this->callNotFoundRoute();
            return;
        }
        
        if($parameters === true) {
            // the route has requested that the access_denied view be rendered
            $this->callAccessDeniedRoute();
            return;
        }
        
        $this->renderView(($controller ? $controller->getRouteName() : $route_name), $parameters);
    }
    
    function callNotFoundRoute() {
        header('HTTP/1.0 404 Not Found');
        header('Status: 404 Not Found');
        if(isset($this->routes[$this->not_found_route])) {
            $this->callRoute($this->not_found_route);
        }
    }
    
    function callAccessDeniedRoute() {
        header('HTTP/1.1 403 Forbidden');
        header('Status: 403 Forbidden');
        if(isset($this->routes[$this->access_denied_route])) {
            $this->callRoute($this->access_denied_route);
        }
    }
    
    function set($route_name, $controller, $args, $roles) {
        $this->routes[$route_name] = array(
            "controller" => $controller,
            "controller_arguments" => $args,
            "roles" => $roles
        );
    }
    
    static function redirect($route_name,$skip_destination = false) {
        $destination = filter_input(INPUT_GET,"destination");
        if($destination && !$skip_destination) {
            $route_name = $destination;
        }
        if(stripos($route_name,"http://")===false) {
            header("Location:".Router::getIndex().$route_name.($skip_destination && stripos($route_name,"destination")===false ? (stripos("?",$destination)!==false ? "&" : "?")."destination={$destination}" : "" ));
        } else {
            header("Location:".$route_name.($skip_destination ? (stripos("?",$destination)!==false ? "&" : "?")."destination={$destination}" : "" ));
        }
    }
    
    function getRoute() {
        return $this->full_route;
    }
    
    function setAlwaysLoadBaseLayout($bool) {
        $this->alwaysLoadBaseLayout = $bool;
    }
    
    function setDefaultRoute($route_name) {
        $this->default_route = $route_name;
    }
    
    function setNotFoundRoute($route_name) {
        $this->not_found_route = $route_name;
    }
    
    function setAccessDeniedRoute($route_name) {
        $this->access_denied_route = $route_name;
    }
    
    function setCheckAccessFunction($function) {
        $this->check_access_function = $function;
    }
    
    function setWebContentFolder($folder) {
        $this->web_content_folder = $folder;
    }
    
    static function getLocalIndex() {
        return str_ireplace("index.php", "", $_SERVER['PHP_SELF']);
    }
    
    static function getIndex() {
        return (!isset($_SERVER["HTTPS"]) || (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "off") ? 'http' : 'https')."://". $_SERVER['HTTP_HOST']. Router::getLocalIndex();
    }
    
    static function getUrl() {
        return (!isset($_SERVER["HTTPS"]) || (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "off") ? 'http' : 'https')."://". $_SERVER['HTTP_HOST']. str_ireplace("index.php", "", $_SERVER['PHP_SELF']). ($_SERVER['QUERY_STRING']!='' ? "?". $_SERVER['QUERY_STRING'] : "");
    }
}
?>
