<!DOCTYPE html>
<html class="" lang="en">
<head  >

    <? require_once VIEW_PATH.'gitlab/common/header/include.php';?>

</head>
<body class="" data-group="" data-page="projects:issues:index" data-project="xphp">
<? require_once VIEW_PATH.'gitlab/common/body/script.php';?>


<header class="navbar navbar-gitlab with-horizontal-nav">
    <a class="sr-only gl-accessibility" href="#content-body" tabindex="1">Skip to content</a>
    <div class="container-fluid">
        <? require_once VIEW_PATH.'gitlab/common/body/header-content.php';?>
    </div>
</header>
<script>
    var findFileURL = "/ismond/xphp/find_file/master";
</script>
<div class="page-with-sidebar">
    <? require_once VIEW_PATH.'gitlab/admin/common-page-nav-admin.php';?>


    <div class="content-wrapper page-with-layout-nav page-with-sub-nav">
        <div class="alert-wrapper">

            <div class="flash-container flash-container-page">
            </div>

        </div>
        <div class="container-fluid ">

            <div class="content" id="content-body">

                <?php include VIEW_PATH.'gitlab/admin/common_system_left_nav.php';?>

                <div class="panel"  style="margin-left:160px;">
                    <button class="btn btn-save " onclick="recover()">恢复数据</button>
                    <div></div>
                    <form class="new_project" id="new_project" action="" accept-charset="UTF-8" method="post">
                        <div class="row">
                            <?php if(!empty($file_list)){foreach ($file_list as $file) { ?>
                                <div class="radio">
                                    <label>
                                        <input type="radio" name="select_file" value="<?=$file?>"><?=$file?>
                                    </label>
                                </div>
                            <?php }}else{echo '没有备份文件....';} ?>
                        </div>
                    </form>

                    <div>
                        <iframe id="iframe_load" src="" width="100%" height="1500px;">
                        </iframe>
                    </div>
                </div>

            </div>
            
        </div>
    </div>
</div>


<script>


    function recover() {
        var file = $("input[name='select_file']:checked").val();
        $('#iframe_load').attr("src", "<?=ROOT_URL?>admin/data_backup/iframe_recover?dump_file_name="+file);
    }

</script>





</body>
</html>