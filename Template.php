<?php
class Template {
    static function load($filename,$variables = array()) {
        if(!file_exists($filename)) {
            return "";
        }
        
        $file = file_get_contents($filename);
        
        // loop through the passed variables and set them so they exist in the scope of the eval call
        foreach($variables as $key=>$val) {
            $$key = $val;
        }
        
        // use eval with ob_start so we can return the result or the evaluated html with php inserts
        ob_start();
        echo eval("?>".$file);
        $buffer = ob_get_contents();
        @ob_end_clean();

        return $buffer;
    }
    
    static function dataValues($content,$variables) {
        $response = preg_replace_callback('/{(.+?)}/ix',function($match)use($variables){
             return isset($variables[$match[1]]) ? $variables[$match[1]] : $match[0];
        },$content);
        return $response;
    }
    
    static function html_to_csv($table) {
        $html = str_get_html($table); // give this your HTML string
        
        header('Content-type: application/ms-excel');
        header("Content-Disposition: attachment; filename={$GLOBALS["title"]}.csv");
        
        $fp = fopen("php://output", "w");
        
        foreach ($html->find('tr') as $element) {
            $td = array();
            foreach ($element->find('th') as $row) {
                if (strpos(trim($row->class), 'actions') === false && strpos(trim($row->class), 'checker') === false) {
                    $td [] = $row->plaintext;
                }
            }
            if (!empty($td)) {
                fputcsv($fp, $td);
            }

            $td = array();
            foreach ($element->find('td') as $row) {
                if (strpos(trim($row->class), 'actions') === false && strpos(trim($row->class), 'checker') === false) {
                    $td [] = $row->plaintext;
                }
            }
            if (!empty($td)) {
                fputcsv($fp, $td);
            }
        }
        
        fclose($fp);
        exit;
    }
    
    static function toTitleCase($text) {
        preg_match_all('/[A-Z]/', $text, $matches, PREG_OFFSET_CAPTURE);

        foreach($matches[0] as $match) {
            $text = str_replace($match[0], " ".$match[0], $text);
        }

        return ucwords(str_ireplace("_", " ", $text));
    }
}

function array_select($array, $selectKeys) {
    $newArray = array();
    foreach($selectKeys as $key) {
        if(isset($array[$key])) {
            $newArray[$key] = $array[$key];
        }
    }
    return $newArray;
}

/**
 * Generate a GUID
 * 
 * uses com_create_guid if it exists.
 * 
 * @return string 36 characters long
 */
function str_guid() {
    if (function_exists('com_create_guid') === true) {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}

function str_camel_case_to_words($camelCaseString) {
    $re = '/(?<=[a-z])(?=[A-Z])/x';
    $a = preg_split($re, $camelCaseString);
    return str_replace("_"," ",join($a, " " ));
}

// This function expects the input to be UTF-8 encoded.
function str_slugify($text,$spacer = '-')
{
    // Swap out Non "Letters" with a -
    $text = preg_replace('/[^\\pL\d]+/u', $spacer, $text); 

    // Trim out extra -'s
    $text = trim($text, $spacer);

    // Convert letters that we have left to the closest ASCII representation
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

    // Make text lowercase
    $text = strtolower($text);

    // Strip out anything we haven't been able to convert
    $text = preg_replace('/[^-\w]+/', '', $text);

    return $text;
}

function str_esc($str) {
    return strtr($str, array(
        "\0" => "",
        "'"  => "&#39;",
        "\"" => "&#34;",
        "\\" => "&#92;",
        // more secure
        "<"  => "&lt;",
        ">"  => "&gt;",
    ));
}

function str_trunc_html($text, $length = 100, $ending = '...', $exact = false, $considerHtml = true) {
    if ($considerHtml) {
        // if the plain text is shorter than the maximum length, return the whole text
        if (strlen(preg_replace('/<.*?>/', '', $text)) <= $length) {
            return $text;
        }
        // splits all html-tags to scanable lines
        preg_match_all('/(<.+?>)?([^<>]*)/s', $text, $lines, PREG_SET_ORDER);
        $total_length = strlen($ending);
        $open_tags = array();
        $truncate = '';
        foreach ($lines as $line_matchings) {
            // if there is any html-tag in this line, handle it and add it (uncounted) to the output
            if (!empty($line_matchings[1])) {
                // if it's an "empty element" with or without xhtml-conform closing slash
                if (preg_match('/^<(\s*.+?\/\s*|\s*(img|br|input|hr|area|base|basefont|col|frame|isindex|link|meta|param)(\s.+?)?)>$/is', $line_matchings[1])) {
                    // do nothing
                    // if tag is a closing tag
                } else if (preg_match('/^<\s*\/([^\s]+?)\s*>$/s', $line_matchings[1], $tag_matchings)) {
                    // delete tag from $open_tags list
                    $pos = array_search($tag_matchings[1], $open_tags);
                    if ($pos !== false) {
                        unset($open_tags[$pos]);
                    }
                    // if tag is an opening tag
                } else if (preg_match('/^<\s*([^\s>!]+).*?>$/s', $line_matchings[1], $tag_matchings)) {
                    // add tag to the beginning of $open_tags list
                    array_unshift($open_tags, strtolower($tag_matchings[1]));
                }
                // add html-tag to $truncate'd text
                $truncate .= $line_matchings[1];
            }
            // calculate the length of the plain text part of the line; handle entities as one character
            $content_length = strlen(preg_replace('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|[0-9a-f]{1,6};/i', ' ', $line_matchings[2]));
            if ($total_length + $content_length > $length) {
                // the number of characters which are left
                $left = $length - $total_length;
                $entities_length = 0;
                // search for html entities
                if (preg_match_all('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|[0-9a-f]{1,6};/i', $line_matchings[2], $entities, PREG_OFFSET_CAPTURE)) {
                    // calculate the real length of all entities in the legal range
                    foreach ($entities[0] as $entity) {
                        if ($entity[1] + 1 - $entities_length <= $left) {
                            $left--;
                            $entities_length += strlen($entity[0]);
                        } else {
                            // no more characters left
                            break;
                        }
                    }
                }
                $truncate .= substr($line_matchings[2], 0, $left + $entities_length);
                // maximum lenght is reached, so get off the loop
                break;
            } else {
                $truncate .= $line_matchings[2];
                $total_length += $content_length;
            }
            // if the maximum length is reached, get off the loop
            if ($total_length >= $length) {
                break;
            }
        }
    } else {
        if (strlen($text) <= $length) {
            return $text;
        } else {
            $truncate = substr($text, 0, $length - strlen($ending));
        }
    }
    // if the words shouldn't be cut in the middle...
    if (!$exact) {
        // ...search the last occurance of a space...
        $spacepos = strrpos($truncate, ' ');
        if (isset($spacepos)) {
            // ...and cut the text in this position
            $truncate = substr($truncate, 0, $spacepos);
        }
    }
    // add the defined ending to the text
    $truncate .= $ending;
    if ($considerHtml) {
        // close all unclosed html-tags
        foreach ($open_tags as $tag) {
            $truncate .= '</' . $tag . '>';
        }
    }
    return $truncate;
}

// function defination to convert array to xml
function array_to_xml($student_info, &$xml_student_info) {
    foreach($student_info as $key => $value) {
        if(is_array($value)) {
            if(!is_numeric($key)){
                $subnode = $xml_student_info->addChild("$key");
                array_to_xml($value, $subnode);
            }
            else{
                array_to_xml($value, $xml_student_info);
            }
        }
        else {
            $xml_student_info->addChild("$key","$value");
        }
    }
}