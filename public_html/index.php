<?php include('header.php') ?>
<?php include('data.php') ?>

<div id='panel'>
    <h1>Todo List</h1>
    <div id='todolist'>
        <ul id='todolist-ul'>
            
            <li class='clearfix new'>
                <div class='checkbox'></div>
                <div class='new_content' style='cursor: text;' contenteditable=true>Click to add new task...</div>
            </li>
            
            <script id='todolist-item-template' type='text/x-handlebars-template'>
                <li data-id='{{id}}' class='clearfix {{#if is_complete}}complete{{/if}}'>
                    <div class='checkbox'></div>
                    <div class='content'>{{content}}</div>
                    <div class='actions'>
                        <div class='delete'>x</div>
                    </div>
                </li>
            </script>

        </ul>
    </div>
</div>

<?php include('footer.php') ?>