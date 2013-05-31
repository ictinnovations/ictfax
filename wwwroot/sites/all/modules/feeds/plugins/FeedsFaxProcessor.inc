<?php

/**
 * @file
 * Class definition of FeedsFaxProcessor.
 */

/**
 * Creates nodes from feed items.
 */
class FeedsFaxProcessor extends FeedsProcessor {
  /**
   * Define entity type.
   */
  public function entityType() {
    return 'node';
  }

  /**
   * Implements parent::entityInfo().
   */
  protected function entityInfo() {
    $info = parent::entityInfo();
    $info['label plural'] = t('Nodes');
    return $info;
  }

  /**
   * Creates a new node in memory and returns it.
   */
  protected function newEntity(FeedsSource $source) {
    $node = new stdClass();
    $node->type = $this->config['content_type'];
    $node->changed = REQUEST_TIME;
    $node->created = REQUEST_TIME;
    $node->language = LANGUAGE_NONE;
    node_object_prepare($node);
    // Populate properties that are set by node_object_prepare().
    $node->log = 'Created by FeedsFaxProcessor';
    $node->uid = $this->config['author'];
    return $node;
  }

  /**
   * Loads an existing node.
   *
   * If the update existing method is not FEEDS_UPDATE_EXISTING, only the node
   * table will be loaded, foregoing the node_load API for better performance.
   */
  protected function entityLoad(FeedsSource $source, $nid) {
    if ($this->config['update_existing'] == FEEDS_UPDATE_EXISTING) {
      $node = node_load($nid, NULL, TRUE);
    }
    else {
      // We're replacing the existing node. Only save the absolutely necessary.
      $node = db_query("SELECT created, nid, vid, type FROM {node} WHERE nid = :nid", array(':nid' => $nid))->fetchObject();
      $node->uid = $this->config['author'];
    }
    node_object_prepare($node);
    // Populate properties that are set by node_object_prepare().
    if ($this->config['update_existing'] == FEEDS_UPDATE_EXISTING) {
      $node->log = 'Updated by FeedsFaxProcessor';
    }
    else {
      $node->log = 'Replaced by FeedsFaxProcessor';
    }
    return $node;
  }

  /**
   * Save a node.
   */
  public function entitySave($entity) {
    global $user;
    //node_save($entity);
    $errors = null;
    $path = variable_get('fax_directory', '/usr/ictfax/sites/default/files/ictfax/webfax');
    file_prepare_directory($path, FILE_CREATE_DIRECTORY);

    $from = $entity->emailheader->from[0];
    $to = $entity->emailheader->to[0];
    $fromAddress = $from->mailbox . '@' . $from->host;
    $toNumber = $to->mailbox;
    
    // Following if block is for testing only
    if($toNumber == 'falak') {
      $toNumber = '1003'; 
    }
    
    // Select which user sent this email
    $query = "SELECT * from ictpbx_user where mail= :mail";
    $result = db_query($query, array(':mail'=>$fromAddress));
    if($ictpbx_user = $result->fetchAssoc()) {
      
      $fax['text'] = ''; //addcslashes($entity->body['und'][0]->value,'$"\\');
      $fax['status'] = '0';
      $fax['status_string'] = 'in queue';
      //$fax['file_name'] = $entity->field_file['und'][0]['filename'];
      //$fax['file_path'] = $entity->field_file['und'][0]['uri'];
      $fax['file_type'] = 'tif';
      $fax['pages'] = 0;
      $fax['uid'] = $ictpbx_user['uid']; // $uid of from address
      $fax['created'] = time();
      $fax['changed'] = time();
      $fax['send_to'] = $toNumber;  
      $fax['send_from'] = $ictpbx_user['ictpbx_user_id'];   // id of fromaddress
      $fax['rating'] = 3;
      $fax['accountcode']= '';
      $fax['submitted_from'] = 'email';
          
      drupal_write_record('fax_outbox', $fax); 
            
      $allowedTypes = array(
         1=>'odt',  2=>'ott',  3=>'sxw',  4=>'stw',  5=>'doc',  6=>'dot',  7=>'sdw',  8=>'vor',  9=>'htm', 10=>'sdd', 
        11=>'sdp', 12=>'wpd', 13=>'ods', 14=>'ots', 15=>'sxc', 16=>'stc', 17=>'xls', 18=>'xlw', 19=>'xlt', 20=>'sdc', 
        21=>'csv', 22=>'odp', 23=>'otp', 24=>'sxi', 25=>'sti', 26=>'ppt', 27=>'pps', 28=>'pot', 29=>'sxd', 30=>'odt', 
        31=>'ott', 32=>'sxw', 33=>'stw', 34=>'doc', 35=>'dot', 36=>'sdw', 37=>'vor', 38=>'htm', 39=>'sdd', 40=>'sdp', 
        41=>'wpd', 42=>'ods', 43=>'ots', 44=>'sxc', 45=>'stc', 46=>'xls', 47=>'xlw', 48=>'xlt', 49=>'sdc', 50=>'csv', 
        51=>'odp', 52=>'otp', 53=>'sxi', 54=>'sti', 55=>'ppt', 56=>'pps', 57=>'pot', 58=>'sxd', 59=>'txt', 60=>'tif', 
        61=>'jpg', 62=>'pdf', 63=>'png', 64=>'gif',
      );
      echo exec("echo Executing Email2Fax > /tmp/mytest.txt");
      //$sourceFile = '/tmp/'.$fax['file_name'];
      
      
      if (isset($entity->field_file['und'][0]['filename']) && $entity->field_file['und'][0]['filename'] != '') {
        $sourceFile = "/usr/ictfax/sites/default/files/" . $entity->field_file['und'][0]['filename'];
        $fileExten = strtolower(end(explode('.', $sourceFile)));
        echo exec("echo file extensions from Email2fax: $fileExten >> /tmp/mytest.txt");
        if (in_array($fileExten, $allowedTypes)) {
          $fileName = $sourceFile;
          echo exec("echo file:$fileName >> /tmp/mytest.txt");
          if ($fileExten == 'tif') {
            echo exec("echo tif file >> /tmp/mytest.txt");
            $pdfFilePath = str_replace('.tif', '.pdf', $fileName);
            $cmd = ictfax_which('tiff2pdf', '/usr/bin') . " -o $pdfFilePath -z $fileName";
            exec($cmd);
            $cmd = "rm -rf $fileName";
            // existing tiff file must be deleted before new tiff file creation
            exec($cmd);
          } elseif ($fileExten == 'txt') {
            echo exec("echo txt file >> /tmp/mytest.txt");
            $psFilePath = str_replace('.txt', '.ps', $fileName);
            $pdfFilePath = str_replace('.ps', '.pdf', $psFilePath);
            $cmd = ictfax_which('uniprint', '/usr/local/bin') . " -hsize 0 -size 9 -in $fileName -out $psFilePath";
            exec($cmd);
            $cmd = "rm -rf $fileName";
            $cmd = ictfax_which('ps2pdf', '/usr/bin') . " $psFilePath $pdfFilePath";
            exec($cmd);
            $cmd = "rm -rf $psFilePath";
          } elseif ($fileExten == 'jpg') {
            echo exec("echo jpg file >> /tmp/mytest.txt");
            $pdfFilePath = str_replace('.jpg', '.pdf', $fileName);
            $cmd = ictfax_which('convert', '/usr/bin') . " $fileName -type Bilevel -monochrome $pdfFilePath";
            exec($cmd);
            $cmd = "rm -rf $fileName";
          } elseif ($fileExten == 'png') {
            echo exec("echo png file >> /tmp/mytest.txt");
            $pdfFilePath = str_replace('.png', '.pdf', $fileName);
            $cmd = ictfax_which('convert', '/usr/bin') . " $fileName -type Bilevel -monochrome $pdfFilePath";
            exec($cmd);
            $cmd = "rm -rf $fileName";
          } elseif ($fileExten == 'gif') {
            echo exec("echo gif file >> /tmp/mytest.txt");
            $pdfFilePath = str_replace('.gif', '.pdf', $fileName);
            $cmd = ictfax_which('convert', '/usr/bin') . " $fileName -type Bilevel -monochrome $pdfFilePath";
            exec($cmd);
            $cmd = "rm -rf $fileName";
          } elseif ($fileExten == 'pdf') {
            echo exec("echo pdf file >> /tmp/mytest.txt");
            $pdfFilePath = $fileName;
          } elseif (in_array($fileExten, $allowedTypes)) {
            echo exec("echo any other file >> /tmp/mytest.txt");
            $pdfFilePath = str_replace($allowedTypes, 'pdf', $fileName);
            $cmd = ictfax_which('makepdf.sh', '/usr/ictfax/wwwroot/modules/email2fax') . " $fileName";
            exec($cmd);
            $cmd = "rm -rf $fileName";
            exec($cmd); 
          } 
          // get total page count of pdf
          $cmd = ictfax_which('pdfinfo', '/usr/bin') . " '$pdfFilePath' | sed -n 's#^Pages:[^0-9]*\\([0-9.]*\)$#\\1#p'";
          exec($cmd, $pages);
          echo exec("echo '".print_r($pages, true)."' >> /tmp/mytest.txt");
      
          $fileNameTiff = str_replace('.pdf', '.tif', $pdfFilePath);
          $cmd = ictfax_which('gs', '/usr/bin') . " -dBATCH -dNOPAUSE -sDEVICE=tiffg4 -sPAPERSIZE=a4 -r204x98 -dAutoRotatePages -sOutputFile=$fileNameTiff $pdfFilePath";
          exec($cmd);
          $cmd = "chmod -R 777 $path";
          exec($cmd);
          
          echo exec("echo converting back to tif: $fileNameTiff, $pdfFilePath >> /tmp/mytest.txt");
          $targetTifFile = "$path/$fax[cid].tif";
          $cmd = "cp $fileNameTiff $targetTifFile";
          exec($cmd);

          if (!$pages[0] || $pages[0] < 1) {
            //drupal_set_message(t('unknown error occured while processing file.'), 'error');
            $errors = 'Unknown error occured while processing file';
          }
          $fax['file_path'] = $fileNameTiff;
        } else {
          $errors = 'Unknown file extension';
        }
      } else {
        // send email back notifying no attachments found to as fax
        $errors = 'No attachment found';
      } 
      /////////////////////////////////////////
      // Perform balance check before dialing//
      /////////////////////////////////////////
      if($pdfFilePath) {
        $cmd = "rm -rf $pdfFilePath";
        exec($cmd);
        $fax['pages'] = $pages[0];
      }
      //echo exec("echo '".print_r($fax['pages'], true)."' >> /tmp/mytest.txt");
      
      if (isset($fax['pages']) && $fax['pages'] > 0) {
        $status = module_invoke_all('check_balance', $fax);
        if(is_array($status) && isset($status[0])) {
          $status = $status[0];
        } else {
          $status = TRUE; // set to TRUE to send fax without billing
        }
        echo exec("echo 'remaining-balance-status=".print_r($status, true)."' >> /tmp/mytest.txt");
        if($status) {
          //$fax['file_name'] = "$fax[cid].tif";
          drupal_write_record('fax_outbox', $fax, 'cid');
          ictfax_sendfax($fax['uid'], $fax);
          drupal_set_message(t('Fax sent successfully!'), 'status');
        } else {
          //drupal_set_message(t('Insufficient balance!'), 'error');
          $errors = 'Insufficient balance to send fax!';
        }
      } else {
        //drupal_set_message(t('No pages or error opening file!'), 'error');
        $errors = 'No pages or error opening attachment!';
      }
      
    } //end if
     
    if($errors!=null) {
      echo exec("echo Executing email error condition >> /tmp/mytest.txt");
      $emailData['submitted_from']= $from->mailbox ."@". $from->host;
      $emailData['send_to']       = $to->mailbox;
      $emailData['subject']       = $entity->emailheader->subject;
      //$emailData['text']         = $entity->emailhader->body;
      $emailData['send_from']     = '';
      $emailData['rating']        = '';
      
      // get user name
      $sql    = "SELECT name FROM {ictpbx_user} WHERE uid = :uid";
      $user = db_query($sql, array(':uid' => $fax['uid']))->fetchAssoc();
      ictfax_sendmail_error($user['name'], $emailData, $errors);

    }  
  }

  /**
   * Delete a series of nodes.
   */
  protected function entityDeleteMultiple($nids) {
    node_delete_multiple($nids);
  }

  /**
   * Implement expire().
   *
   * @todo: move to processor stage?
   */
  public function expire($time = NULL) {
    if ($time === NULL) {
      $time = $this->expiryTime();
    }
    if ($time == FEEDS_EXPIRE_NEVER) {
      return;
    }
    $count = $this->getLimit();
    $nodes = db_query_range("SELECT n.nid FROM {node} n JOIN {feeds_item} fi ON fi.entity_type = 'node' AND n.nid = fi.entity_id WHERE fi.id = :id AND n.created < :created", 0, $count, array(':id' => $this->id, ':created' => REQUEST_TIME - $time));
    $nids = array();
    foreach ($nodes as $node) {
      $nids[$node->nid] = $node->nid;
    }
    $this->entityDeleteMultiple($nids);
    if (db_query_range("SELECT 1 FROM {node} n JOIN {feeds_item} fi ON fi.entity_type = 'node' AND n.nid = fi.entity_id WHERE fi.id = :id AND n.created < :created", 0, 1, array(':id' => $this->id, ':created' => REQUEST_TIME - $time))->fetchField()) {
      return FEEDS_BATCH_ACTIVE;
    }
    return FEEDS_BATCH_COMPLETE;
  }

  /**
   * Return expiry time.
   */
  public function expiryTime() {
    return $this->config['expire'];
  }

  /**
   * Override parent::configDefaults().
   */
  public function configDefaults() {
    $types = node_type_get_names();
    $type = isset($types['article']) ? 'article' : key($types);
    return array(
      'content_type' => $type,
      'expire' => FEEDS_EXPIRE_NEVER,
      'author' => 0,
    ) + parent::configDefaults();
  }

  /**
   * Override parent::configForm().
   */
  public function configForm(&$form_state) {
    $types = node_type_get_names();
    array_walk($types, 'check_plain');
    $form = parent::configForm($form_state);
    $form['content_type'] = array(
      '#type' => 'select',
      '#title' => t('Content type'),
      '#description' => t('Select the content type for the nodes to be created. <strong>Note:</strong> Users with "import !feed_id feeds" permissions will be able to <strong>import</strong> nodes of the content type selected here regardless of the node level permissions. Further, users with "clear !feed_id permissions" will be able to <strong>delete</strong> imported nodes regardless of their node level permissions.', array('!feed_id' => $this->id)),
      '#options' => $types,
      '#default_value' => $this->config['content_type'],
    );
    $author = user_load($this->config['author']);
    $form['author'] = array(
      '#type' => 'textfield',
      '#title' => t('Author'),
      '#description' => t('Select the author of the nodes to be created - leave empty to assign "anonymous".'),
      '#autocomplete_path' => 'user/autocomplete',
      '#default_value' => empty($author->name) ?  'anonymous' : check_plain($author->name),
    );
    $period = drupal_map_assoc(array(FEEDS_EXPIRE_NEVER, 3600, 10800, 21600, 43200, 86400, 259200, 604800, 2592000, 2592000 * 3, 2592000 * 6, 31536000), 'feeds_format_expire');
    $form['expire'] = array(
      '#type' => 'select',
      '#title' => t('Expire nodes'),
      '#options' => $period,
      '#description' => t('Select after how much time nodes should be deleted. The node\'s published date will be used for determining the node\'s age, see Mapping settings.'),
      '#default_value' => $this->config['expire'],
    );
    $form['update_existing']['#options'] = array(
      FEEDS_SKIP_EXISTING => 'Do not update existing nodes',
      FEEDS_REPLACE_EXISTING => 'Replace existing nodes',
      FEEDS_UPDATE_EXISTING => 'Update existing nodes (slower than replacing them)',
    );
    return $form;
  }

  /**
   * Override parent::configFormValidate().
   */
  public function configFormValidate(&$values) {
    if ($author = user_load_by_name($values['author'])) {
      $values['author'] = $author->uid;
    }
    else {
      $values['author'] = 0;
    }
  }

  /**
   * Reschedule if expiry time changes.
   */
  public function configFormSubmit(&$values) {
    if ($this->config['expire'] != $values['expire']) {
      feeds_reschedule($this->id);
    }
    parent::configFormSubmit($values);
  }

  /**
   * Override setTargetElement to operate on a target item that is a node.
   */
  public function setTargetElement(FeedsSource $source, $target_node, $target_element, $value) {
    switch ($target_element) {
      case 'created':
        $target_node->created = feeds_to_unixtime($value, REQUEST_TIME);
        break;
      case 'feeds_source':
        // Get the class of the feed node importer's fetcher and set the source
        // property. See feeds_node_update() how $node->feeds gets stored.
        if ($id = feeds_get_importer_id($this->config['content_type'])) {
          $class = get_class(feeds_importer($id)->fetcher);
          $target_node->feeds[$class]['source'] = $value;
          // This effectively suppresses 'import on submission' feature.
          // See feeds_node_insert().
          $target_node->feeds['suppress_import'] = TRUE;
        }
        break;
      default:
        parent::setTargetElement($source, $target_node, $target_element, $value);
        break;
    }
  }

  /**
   * Return available mapping targets.
   */
  public function getMappingTargets() {
    $type = node_type_get_type($this->config['content_type']);
    $targets = parent::getMappingTargets();
    if ($type->has_title) {
      $targets['title'] = array(
        'name' => t('Title'),
        'description' => t('The title of the node.'),
      );
    }
    $targets += array(
      'nid' => array(
        'name' => t('Node ID'),
        'description' => t('The nid of the node. NOTE: use this feature with care, node ids are usually assigned by Drupal.'),
        'optional_unique' => TRUE,
      ),
      'uid' => array(
        'name' => t('User ID'),
        'description' => t('The Drupal user ID of the node author.'),
      ),
      'status' => array(
        'name' => t('Published status'),
        'description' => t('Whether a node is published or not. 1 stands for published, 0 for not published.'),
      ),
      'created' => array(
        'name' => t('Published date'),
        'description' => t('The UNIX time when a node has been published.'),
      ),
    );
    // If the target content type is a Feed node, expose its source field.
    if ($id = feeds_get_importer_id($this->config['content_type'])) {
      $name = feeds_importer($id)->config['name'];
      $targets['feeds_source'] = array(
        'name' => t('Feed source'),
        'description' => t('The content type created by this processor is a Feed Node, it represents a source itself. Depending on the fetcher selected on the importer "@importer", this field is expected to be for example a URL or a path to a file.', array('@importer' => $name)),
        'optional_unique' => TRUE,
      );
    }

    // Let other modules expose mapping targets.
    self::loadMappers();
    feeds_alter('feeds_processor_targets', $targets, 'node', $this->config['content_type']);

    return $targets;
  }

  /**
   * Get nid of an existing feed item node if available.
   */
  protected function existingEntityId(FeedsSource $source, FeedsParserResult $result) {
    if ($nid = parent::existingEntityId($source, $result)) {
      return $nid;
    }

    // Iterate through all unique targets and test whether they do already
    // exist in the database.
    foreach ($this->uniqueTargets($source, $result) as $target => $value) {
      switch ($target) {
        case 'nid':
          $nid = db_query("SELECT nid FROM {node} WHERE nid = :nid", array(':nid' => $value))->fetchField();
          break;
        case 'feeds_source':
          if ($id = feeds_get_importer_id($this->config['content_type'])) {
            $nid = db_query("SELECT fs.feed_nid FROM {node} n JOIN {feeds_source} fs ON n.nid = fs.feed_nid WHERE fs.id = :id AND fs.source = :source", array(':id' => $id, ':source' => $value))->fetchField();
          }
          break;
      }
      if ($nid) {
        // Return with the first nid found.
        return $nid;
      }
    }
    return 0;
  }
}
