import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Modal, Icon } from 'antd';
import forge from 'node-forge';
import Login from '@/components/Login';
import styles from './Login.less';
const _baseApi = '/ncbx-admin';
const { Tab, UserName, Password, Mobile, Captcha, Submit,ImgCaptcha} = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    imgSrc: '/system/captcha/make',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);

          Modal.info({
            title: formatMessage({ id: 'app.login.verification-code-warning' }),
          });
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      const md = forge.md.md5.create();
      md.update(values.password);
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          password:md.digest().toHex(),
        },
        callback:()=>this.onGetImgCaptcha()
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  //点击获取图形验证码
  onGetImgCaptcha = () => {
    this.setState({
      imgSrc: _baseApi + '/system/captcha/make?v=' + new Date().getTime(),
    });
  };

  componentDidMount() {
    this.setState({
      imgSrc: _baseApi + '/system/captcha/make?v=' + new Date().getTime(),
    });
  }
  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="userName"
              placeholder="账号"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            <ImgCaptcha
              name="validateCode"
              placeholder="请输入图形验证码"
              onGetCode={this.onGetImgCaptcha}
              src={this.state.imgSrc}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {/*<div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>*/}
        </Login>
      </div>
    );
  }
}

export default LoginPage;
