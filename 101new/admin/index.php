<? function start($name){if(!file_exists('../'.$name)){$file='start/'.$name;$new_file='../'.$name;copy($file,$new_file);}}start('admin.php');start('pagedot-config.php');header('Location: ../admin.php'); ?>