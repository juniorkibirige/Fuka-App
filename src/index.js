import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import axios from 'axios'
import BSAlert from 'sweetalert'

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert:'',
            m_num: '',
            p_num: null,
            amount: '',
            error_msg: '',
            fieldset1: false,
            fieldset2: true,
            fieldset3: true,
            deviceId: '',
            units: '',
            p_unt: 3516,
            token: 'Is being generated ...',
            btn_checkout: true,
        };

        this.updateInput = this.updateInput.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
    }

    getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    updateInput = ({target}) => {
        const input = target.value
        if (!isNaN(+input)) {
            this.setState({[target.name]: input})
            this.setState({error_msg: ''})
        } else {
            this.setState({[target.name]: input})
            if (target.name === "m_num")
                this.setState({error_msg: 'Invalid Meter Number'})
            else if (target.name === "amount")
                this.setState({error_msg: 'Invalid amount '})
        }
        if (target.name === "amount") {
            let unt = Math.round10(input / this.state.p_unt, -2)
            this.setState({units: unt})
        }
    }

    clickHandler = () => {
        if (this.validate()) {
            this.setState({fieldset1: !this.state.fieldset1})
            this.setState({fieldset2: !this.state.fieldset2})
        } else {
            this.setState({error_msg: 'Unknown meter number'})
        }
    }

    submitHandler = () => {
        const info = "Meter number: " + this.state.m_num +
            "\nAmount Paid: " + this.state.amount +
            "\nUnits: " + this.state.units +
            "\nToken: " + this.state.token
        const overlay = document.getElementById('ajax_overlay')
        const loading_box = document.getElementById('ajax_loading_box')
        overlay.style.display = 'none'
        loading_box.style.display = 'none';
        this.setState({fieldset2: !this.state.fieldset2})
        this.setState({fieldset3: !this.state.fieldset3})
    }

    genToken = async () => {
        const overlay = document.getElementById('ajax_overlay')
        const loading_box = document.getElementById('ajax_loading_box')
        overlay.style.display = 'block'
        loading_box.style.display = 'block';
        if (this.state.amount === "") {
            this.setState({error_msg: 'Amount field is empty!'})
            return
        }
        if(this.state.p_num === null) {
            this.setState({error_msg: 'Phone number field is empty!!'})
            return
        }
        let token_unencrypted = ''
        let token = ''
        let nits = ''
        const unitString = Math.floor10(this.state.units * 100)
        const uSLen = String(unitString).length
        if (uSLen === 1) {
            nits = nits.concat("0000", unitString)
        } else if (uSLen === 2) {
            nits = nits.concat("000", unitString)
        } else if (uSLen === 3) {
            nits = nits.concat("00", unitString)
        } else if (uSLen === 4) {
            nits = nits.concat("0", unitString)
        } else {
            nits = nits.concat(unitString)
        }
        token_unencrypted = token_unencrypted.concat(this.state.deviceId, nits, this.getKey())
        this.splitValue(token_unencrypted, 4)
        token = token.concat(this.s5, this.s4, this.s3, this.s6)
        const info = "Meter number: " + this.state.m_num +
            "\nAmount Paid: " + this.state.amount +
            "\nUnits: " + this.state.units +
            "\nToken: " + this.state.token +
            "\n SMS Sent to " + this.state.p_num
        this.setState(prevState=>({
            ...prevState,
            alert: (<BSAlert
                info
                style={{ display: "block", marginTop: `10px` }}
                title="Progress"
                onConfirm={() => this.setState({ alert: null })}
                onCancel={() => this.setState({ alert: null })}
                confirmBtnBsStyle="info"
                btnSize=""
            >{info}</BSAlert>)
        }))
        await axios.post('https://fuka-backend.herokuapp.com/api/v1/sms/send', {
            "receipientId": this.state.p_num,
            "token": token,
            "cost": this.state.amount,
            "units": this.state.units
        })
        this.setState({token: token})
        this.setState({btn_checkout: !this.state.btn_checkout})
        this.submitHandler()
    }
    s3 = ''
    s4 = ''
    s5 = ''
    s6 = ''
    splitValue = (value, index) => {
        this.s3 = value.substring(0, index)
        this.s4 = value.substring(index, index + index)
        this.s5 = value.substring(index + index, index + index + index)
        this.s6 = value.substring(index + index + index)
    }

    validate = () => {
        let meter = this.state.m_num
        if (meterNum[meter] !== undefined) {
            this.setState({deviceId: (meterNum[meter])})
            return true
        }
        return false
    }
    Back = () => {
        this.setState({fieldset1: !this.state.fieldset1})
        this.setState({fieldset2: !this.state.fieldset2})
        this.setState({amount: ''})
        this.setState({units: ''})
        this.setState({token: 'Is being generated ...'})
        this.setState({error_msg: ''})
    }
    root = () => {
        this.setState({fieldset1: false})
        this.setState({fieldset2: true})
        this.setState({fieldset3: true})
        this.setState({amount: ''})
        this.setState({units: ''})
        this.setState({token: 'Is being generated ...'})
        this.setState({error_msg: ''})
        this.setState({m_num: ''})
    }
    getKey = () => {
        let key = ''
        let count = 5
        while (count !== 0) {
            key = key.concat(crypt[this.getRandomIntInclusive(0, 13)])
            count -= 1
        }
        return key
    }

    render() {
        const desc = "Next"
        let btn_value = "Pay & Checkout"
        let fieldset1 = ["fieldset1"]
        let fieldset2 = ["fieldset2"]
        let fieldset3 = ["fieldset3"]
        if (this.state.fieldset1) {
            fieldset1.push('inactive')
        }
        if (this.state.fieldset2) {
            fieldset2.push('inactive')
        }
        if (this.state.fieldset3) {
            fieldset3.push('inactive')
        }
        if (!this.state.btn_checkout) {
            btn_value = "Get token"
        }
        return (
            <div className="Content">
                <form id="fukaForm" method="POST" action="" encType="multipart/form-data">
                    <fieldset className={fieldset1.join(' ')}>
                        <h4>Welcome to the Electronic Water Management System.</h4>
                        <p lang="en">Please enter your meter number below:</p>
                        <p lang="ug">Yingiza ennamba ya meter yo mu kabokisi wamanga:</p>
                        <input m_num="m_num" type="text" placeholder="Meter Number" name="m_num" id="m_num"
                               value={this.state.m_num} onChange={this.updateInput} required="yes"/>
                        <p><span className="error-msg" id="error_msg">{this.state.error_msg}</span></p>
                        <button
                            name="next"
                            type="button"
                            onClick={this.clickHandler}
                        >{desc}</button>
                    </fieldset>
                    <fieldset className={fieldset2.join(' ')}>
                        <button className="back" onClick={this.Back}>Back</button>
                        <p><input type="text" className="central" placeholder="Meter Number" readOnly="readonly"
                                  value={this.state.m_num}/></p>
                        <p lang="en">Enter amount of money to pay below:</p>
                        <p lang="ug">Yingiza omuwendo gwa Ssente zo yagala okusasula mu kabokisi wamanga:</p>
                        <p><input type="text" name="amount" id="amount" placeholder="Amount to pay"
                                  onChange={this.updateInput} value={this.state.amount} required/></p>
                        <p><span className="error-msg" id="error_msg">{this.state.error_msg}</span></p>
                        <p>
                            <select style={{display: 'inline-block'}} type="text" name='country_code' id={`cc`}>
                                <option value="+256">UG +256</option>
                            </select>
                            <input type="text" name='p_num' value={this.state.p_num ?? ""} onChange={this.updateInput}/>
                        </p>
                        <p>Number of Units:</p>
                        <p>Omuwendo gwa Uniti zosobola okufuna mu Ssente zzo waggulu:</p>
                        <p><input type="text" readOnly="readonly" name="Units" placeholder="units"
                                  value={this.state.units}/> units @ {this.state.p_unt}/=</p>
                        <input type="button" value={btn_value} onClick={this.genToken}/>
                    </fieldset>
                    <fieldset className={fieldset3.join(' ')}>
                        <div className="message">Your token is {this.state.token}</div>
                        <br></br>
                        <a href="/">
                            <button type="button">Done</button>
                        </a>
                    </fieldset>
                </form>
            </div>
        )
    }
}

class App extends Component {
    render() {
        return (
            <div className="app">
                <div className="container">
                    <div className="ty-ajax-overlay" id="ajax_overlay" style={{backgroundColor: 'rgba(0,0,0,.5)'}}/>
                    <div className="ty-ajax-loading-box" id="ajax_loading_box"/>
                    <Body/>
                </div>
            </div>
        );
    }
}


const meterNum = {
    15404656478716: "AD5DBC",
    15404656479025: "C4DA31",
    15404656787896: "DAC324",
}

const crypt = {
    0: "A", 1: "B", 2: "C", 3: "D",
    4: 0, 5: 1, 6: 2, 7: 3, 8: 4,
    9: 5, 10: 6, 11: 7, 12: 8, 13: 9,
};

(function () {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }

    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
})();

ReactDOM.render(<App/>, document.getElementById('root'));