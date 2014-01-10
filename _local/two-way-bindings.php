<?php require_once("two-way-bindings-config.php"); ?>
<!doctype html>
<html>
    <head>
        <title>AbsurdJS</title>
        <script src="../client-side/build/absurd.js"></script>
    </head>
    <body>
        <div id="content">
            
        </div>
        <script>
            var controller = {
                css: {
                    '#content': {
                        padding: '10px',
                        border: '#999 solid 1px',
                        input: {
                            display: 'block'
                        },
                        span: {
                            display: 'inline-block',
                            padding: '0 2px 0 2px',
                            border: '#999 solid 1px',
                            borderRadius: '2px'
                        }
                    }
                },
                list: [],
                html: {
                    'div': [
                        '<input type="text" data-absurd-event="keyup:input" />',
                        '<input type="button" data-absurd-event="click:method" value="click me" />',
                        '<p><% this.text %></p>',
                        '<div class="spans">',
                        '<% for(var i=0; i<this.list.length; i++) { %>',
                        '<span><% this.list[i] %></span>',
                        '<% } %>',
                        '</div>'
                    ]
                },
                text: '',
                method: function() {
                    this.list[600] = Math.floor((Math.random()*100000)+1);
                    this.populate();
                },
                input: function(e) {
                    this.text = e.target.value;
                    this.populate();
                }
            }
            window.onload = function() {
            	var api = Absurd();
                for(var i=0; i<<?php echo ELEMENTS; ?>; i++) {
                    controller.list.push(i);
                }
            	api.components.register("controller", controller).set("parent", document.querySelector("#content")).populate();
            }
        </script>
    </body>
</html>