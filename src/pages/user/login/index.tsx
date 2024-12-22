import React, { useState } from 'react';
import { message } from 'antd';
import { Link, SelectLang, useModel, history, History, Helmet } from 'umi';
import logo from '@/assets/logo.svg';
import { accountLogin } from '@/services/quark';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';
import {request} from "umi";

const {Tab, Username, Password, Mobile, Email, Captcha, ImageCaptcha, Submit} = LoginFrom;

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const {query} = history.location;
    const {redirect} = query as { redirect: string };
    if (!redirect) {
      history.replace('/');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const {initialState, setInitialState} = useModel('@@initialState');
  const [type, setType] = useState<string>('account');
  const quarkInfo = initialState.quarkInfo;

  /**
   * 用户登录
   */
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const result = await accountLogin({...values, type});
      if (result.status === 'success' && initialState) {
        message.success(result.msg);
        // 记录登录凭据
        sessionStorage.setItem('token', result.data.token);
        const accountInfo = await initialState?.fetchUserInfo();
        const layoutInfo = await initialState?.fetchLayoutInfo();
        const quarkMenus = await initialState?.fetchMenusInfo();
        setInitialState({
          ...initialState,
          accountInfo: accountInfo.data,
          settings: layoutInfo.data,
          quarkMenus: quarkMenus.data
        });
        replaceGoto();

        // 获取拼拼多多PageCode
        await (async function () {
          try {
            const resp = await request('/api/admin/pdd/page/code');
            if (!(resp.code === 0 && resp.data))
              return;
            // @ts-ignore
            await PDD_OPEN_init({code: resp.data})
            // @ts-ignore
            const pati = await window.PDD_OPEN_getPati()
            // 使用 pati
            console.log(`获得拼多多PATI：${pati}`)
            if (pati) {
              sessionStorage.setItem('X_PDD_PAGECODE', resp.data);
              sessionStorage.setItem('X_PDD_PATI', pati);
            }
          } catch (e) {
            console.log(e)
          }
        })()
        return;
      }
      message.error(result.msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const usernameLoginComponent =
    <>
      <Username
        name="username"
        placeholder="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      />
      <Password
        name="password"
        placeholder="密码"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
      <ImageCaptcha
        name="captcha"
        placeholder="图形验证码"
        rules={[
          {
            required: true,
            message: '请输入图形验证码！',
          },
        ]}
      />
    </>;

  const phoneLoginComponent =
    <>
      <Mobile
        name="phone"
        placeholder="手机号"
        rules={[
          {
            required: true,
            message: '请输入手机号！',
          },
          {
            pattern: /^1\d{10}$/,
            message: '手机号格式错误！',
          },
        ]}
      />
      <Password
        name="password"
        placeholder="密码"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
      <ImageCaptcha
        name="captcha"
        placeholder="图形验证码"
        rules={[
          {
            required: true,
            message: '请输入图形验证码！',
          },
        ]}
      />
      {/*<Captcha*/}
      {/*  name="code"*/}
      {/*  placeholder="验证码"*/}
      {/*  countDown={120}*/}
      {/*  getCaptchaButtonText=""*/}
      {/*  getCaptchaSecondText="秒"*/}
      {/*  rules={[*/}
      {/*    {*/}
      {/*      required: true,*/}
      {/*      message: '请输入验证码！',*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
    </>;

  const emailLoginComponent =
    <>
      <Email
        name="email"
        placeholder="邮箱"
        rules={[
          {
            required: true,
            message: '请输入登录邮箱地址！',
          },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式错误！',
          },
        ]}
      />
      <Password
        name="password"
        placeholder="密码"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
      <ImageCaptcha
        name="captcha"
        placeholder="图形验证码"
        rules={[
          {
            required: true,
            message: '请输入图形验证码！',
          },
        ]}
      />
    </>;

  const getLoginForm = (type: any) => {
    let loginForm: any = undefined
    if (type.length > 1) {
      loginForm =
        <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
          <Tab key="username" tab="账户密码登录">
            {usernameLoginComponent}
          </Tab>
          <Tab key="phone" tab="手机号登录">
            {phoneLoginComponent}
          </Tab>
          <Tab key="email" tab="邮箱登录">
            {emailLoginComponent}
          </Tab>
          <Submit loading={submitting}>登录</Submit>
        </LoginFrom>
    } else {
      switch (type[0]) {
        case 'username':
          loginForm = usernameLoginComponent;
          break;
        case 'phone':
          loginForm = phoneLoginComponent;
          break;
        case 'email':
          loginForm = emailLoginComponent;
          break;
        default:
          loginForm = usernameLoginComponent
          break;
      }
      loginForm =
      <LoginFrom onSubmit={handleSubmit}>
        {loginForm}
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    }
    return loginForm;
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8"/>
        <title>{quarkInfo.name ? quarkInfo.name : 'QuarkCMS'}</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang/>
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={quarkInfo.logo ? quarkInfo.logo : logo}/>
                <span className={styles.title}>{quarkInfo.name ? quarkInfo.name : 'QuarkCMS'}</span>
              </Link>
            </div>
            <div className={styles.desc}>{quarkInfo.name ? quarkInfo.description : '信息丰富的世界里，唯一稀缺的就是人类的注意力'}</div>
          </div>

          <div className={styles.main}>
            {getLoginForm(quarkInfo.login_type)}
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Login;
