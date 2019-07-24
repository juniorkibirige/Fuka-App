import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Header(props) {
    return (
        <div className="nav">{props.AppName}</div>
    );
}

class Body extends React.Component {
    render() {
        const desc = "Next";
        return (
            <div className="Content">
                <form id="fukaForm" method="POST" encType="multipart/form-data">
                    <fieldset className="fieldset1">
                        <h4>Welcome to the Electronic Water Management System.</h4>
                        <p lang="en">Please enter your meter number below:</p>
                        <p lang="ug">Yingiza ennamba ya meter yo mu kabokisi wamanga:</p>
                        <input type="text" placeholder="Meter Number" name="m_num" id="m_num" required="yes" />
                        <p><span className="error_msg" id="error_msg"></span></p>
                        <button
                            name="next"
                            type="button"
                            onClick = {validate}
                        >{desc}</button>
                    </fieldset>
                    <fieldset className="fieldset2">
                        <input type="submit" value="Pay & Checkout" />
                    </fieldset>
                </form>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            m_num: null,
        };
    }
    render() {
        const name = "The Fuka App";
        return (
            <div className="app">
                <div className="container">
                    <Header AppName={name} />
                    <Body />
                </div>
            </div>
        );
    }
}

const validate = () => {
    alert("The next button has been clicked!")
}

// const meterNum = {
//     15404656479846: "AD5DBC"
// };

/*
function Controls() {
    var current_fs, next_fs, previous_fs;
    var left, opacity, scale;
    var old_width = 0, new_width;
    var animating;
    var ref = null;
    $('#email').val('');
    $(".next").click(function () {
        current_fs = $(this).parent();
        var fieldsetValue = $("fieldset").index(current_fs);
        if (fieldsetValue == 0) {
            $('#password').val('');
            $('#msg').text('');
            var email = $('#email').val();
            checkEmail(email, function (result) {
                if (result == 1) {
                    next_fs = current_fs.next();
                    animate(next_fs);
                }
            });
        }
        if (fieldsetValue == 1) {
            next_fs = current_fs.next();
            animate(next_fs);
        }
    });

    function animate(next_fs) {
        if (animating) return false;
        animating = true;
        $('.progressbar .bar').animate({
            height: "5px",
            width: old_width + (290 / 2)
        });
        next_fs.show();
        $(".login").animate({
            height: "370px"
        });
        current_fs.animate({
            opacity: 0
        }, {
                step: function (now, mx) {
                    left = (now * (-10)) + "%";
                    opacity = 1 - now;
                    current_fs.css({
                        'transform': 'scale(' + scale + ')'
                    });
                    next_fs.css({
                        'left': left,
                        'opacity': opacity
                    });
                    next_fs.css({
                        'margin-top': '10px',
                        'margin-left': '10px'
                    });
                },
                duration: 200,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                easing: 'easeInOutBack'
            });
    }
    $('.previous').click(function () {
        if (animating) return false;
        animating = true;
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();
        $('.progressbar .bar').animate({
            width: "1%"
        });
        previous_fs.show();
        $(".login").animate({
            height: "300px"
        });
        $('#error_msg').text('');
        current_fs.animate({
            opacity: 0
        }, {
                step: function (now, mx) {
                    scale = 0.8 + (1 - now) * 0.2;
                    left = ((1 - now) * 20) + "%";
                    opacity = 1 - now;
                    current_fs.css({
                        'left': left
                    });
                    previous_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'opacity': opacity
                    });
                },
                duration: 200,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                easing: 'easeInOutBack'
            });
    });
    checkAuthentication()
    function checkAuthentication() {
        var form = $("#msform").get(0);
        $(".submit").on('click', (function (e) {
            e.preventDefault();
            $.ajax({
                url: "/actions/checkAuth.php",
                type: "POST",
                data: new FormData(form),
                contentType: false,
                cache: true,
                dataType: "JSON",
                processData: false,
                success: function (data) {
                    if (data.action == "SHOW_ERROR") {
                        $(".login").animate({
                            height: "410px"
                        });
                        $('#password').css({
                            'border-color': '#dd4b39'
                        });
                        $('#password').focus();
                        $('#msg').css({
                            'color': '#dd4b39',
                            'text-align': 'left'
                        });
                        $('#msg').text(data.msg);
                    } else if (data.action == "SHOW_SUCCESS") {
                        if (ref != null) {
                            window.location.href = ref;
                        }
                        else if (data.level == 1) {
                            window.location.href = "/man/";
                        } else if (data.level == 2) {
                            window.location.href = "/csh/";
                        } else if (data.level == 3) {
                            window.location.href = "/trn/";
                        } else if (data.level == 4) {
                            window.location.href = "/cli/";
                        }
                    }
                },
                error: function () {
                    log("Errors occured: In authentication.");
                    log("window.location.href ='" + ref + "'");
                }
            });
        }));
    }
    function checkEmail(email, callback) {
        $.ajax({
            url: "/actions/checkEmail.php",
            type: "POST",
            dataType: "JSON",
            data: 'user=' + email,
            success: function (data) {
                if (data.action == "SHOW_ERROR") {
                    $('.login').animate({
                        height: "330px"
                    });
                    $('#email').css({
                        'border-color': '#dd4b39'
                    });
                    $('#email').focus();
                    $('#error_msg').text(data.error_msg);
                    var flag = 0;
                } else if (data.action == "SHOW_SUCCESS") {
                    $('#img').html(data.image);
                    $('#userName').text(data.fName + " " + data.lName);
                    $('#userEmail').text(data.email);
                    var flag = 1;
                }
                callback(flag);
            },
            error: function () { log("Error occured: In checking email." + email) }
        });
    }
}*/

ReactDOM.render(<App />, document.getElementById('root'));