$(document).ready(function(){
    //變數放事項的模板
    var source = $('#todolist-item-template').html();
    var todoTemplate = Handlebars.compile(source);

    //prepare todolist items
    var todoListUI = '';
    $.each(todos, function (index, todo) { 
        todoListUI = todoListUI + todoTemplate(todo);
    });//build the todos html string
    $('.new').before(todoListUI);
    
    //當點擊空白處則添加事項
    $('.new').find('.new_content').on('blur', function(e){
        var todo_text = $(e.currentTarget).text();
        todo_text = todo_text.trim();
        var todo;

        if(todo_text.length > 0){
            var order = $('#todolist').find('li:not(.new)').length+1;
            todo = {
                id: -1,
                is_complete: false,
                content: todo_text
            };
            var li = todoTemplate(todo);
            $(e.currentTarget).closest('li').before(li);
            // AJAX: create API
            /**$.post("todo/create.php", {content: todo, order: order},
                function (data, textStatus, jqXHR) {
                    todo = {
                        id: data.id,
                        is_complete: false,
                        content: todo
                    };
                    var li = todoTemplate(todo);
                    $(e.currentTarget).closest('li').before(li);
                    $(e.currentTarget).html('Click to add new task...');
                }
            );**/
            $.ajax({
                type: "POST",
                url: "todo/create.php",
                data: {content: todo_text, order: order},
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    console.log('POST success');
                    $(e.currentTarget).closest('li').prev().attr('data-id', data.id);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('POST error');
                    $(e.currentTarget).closest('li').prev().remove();
                    alert('Database connection error');
                }
            });
            $(e.currentTarget).html('Click to add new task...');
        }else{
            $(e.currentTarget).html('Click to add new task...');
        }
    })
    //點擊新增事項
    $('.new').find('.new_content').on('focus', function(e){
        $(e.currentTarget).html('');
    })
    //點擊叉叉刪除事項
    $('#todolist').on('click', '.delete', function(e){
        var result = confirm('Are you sure you want to delete?');
        var id = $(e.currentTarget).closest('li').data('id');
        if(result){
            //AJAX call
            $.post("todo/delete.php", {id: id},
                function (data, textStatus, jqXHR) {
                    console.log('delete');
                    $(e.currentTarget).closest('li').remove();
                },
            );
        }
    })
    //點擊Checkbox完成事項
    $('#todolist').on('click', '.checkbox', function(e){
        var isComplete = $(e.currentTarget).closest('li').hasClass('complete');
        var id = $(e.currentTarget).closest('li').data('id');
        if(isComplete){
            //complete -> incomplete
            //AJAX
            isComplete = 0;
            $.post("todo/complete.php", {id: id, is_complete: isComplete},
                function (data, textStatus, jqXHR) {
                    $(e.currentTarget).closest('li').removeClass('complete');
                },
            );
        }else{
            //incomplete -> complete
            //AJAX
            isComplete = 1;
            $.post("todo/complete.php", {id: id, is_complete: isComplete},
                function (data, textStatus, jqXHR) {
                    $(e.currentTarget).closest('li').addClass('complete');
                }
            );
        }
    })
    //雙擊可編輯事項
    $('#todolist')
    .on('dblclick', '.content', function(e){
        $(e.currentTarget).prop('contenteditable', true).focus();
    })
    .on('blur', '.content', function(e){
        var id = $(e.currentTarget).closest('li').data('id');
        var content = $(e.currentTarget).text();
        //AJAX call
        $.post("todo/update.php", { id: id, content: content },
            function (data, textStatus, jqXHR) {
                console.log('Update!');
            }
        );
        $(e.currentTarget).prop('contenteditable', false);
    })
    //事項可拖拉
    $('#todolist').find('ul').sortable({
        items: 'li:not(.new)'
    });
});

function isEmpty(el){
    return !$.trim(el.html());
};