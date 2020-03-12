<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors',1);
ini_set('log_errors',1);
ini_set('log_errors_max_len',1024);
ini_set('ignore_repeated_errors',0);
ini_set('ignore_repeated_source',0);
ini_set('report_memleaks',1);
ini_set('track_errors',1);
ini_set('error_log',"php_error_log.txt" );

// place website in development mode
$_GET["dev"] = true;

include_once("includes/Router.php");
include_once("includes/Template.php");

$GLOBALS["SiteName"] = "Company";
$GLOBALS["SiteEmail"] = "admin@company.co.za";

$router = new Router("home", "webcontent");

/*$router->set("home","HomeController",array("generic_name"=>null,"table_name"=>null),array());*/

$router->run();