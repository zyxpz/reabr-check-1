/*
 * @Author: @pinming-chenhao
 * @Date: 2023-12-05 21:50:50
 * @LastEditors: @pinming-chenhao
 * @LastEditTime: 2023-12-07 16:13:22
 * @Description: 构造类免去第三方写iframe
 */
import { h, render, type RendererElement } from 'vue';
interface IProps {
  urlParams: {
    attributionCode: number;
    assembleUrl: string;
  };
  container: RendererElement;
  [key: string]: any;
}

export default class Test {
  states: Partial<IProps> = {};
  protected search: string = '';
  constructor(props: IProps) {
    Object.keys(props).forEach((key) => {
      this.states[key] = props[key];
    });
    window.addEventListener('message', (e) => {
      console.log(e.data.actionType, '第三方');
      if (e.data.actionType === 'confirm') {
        if (this.states.onOk) {
          const { actionType, ...rest } = e.data;
          this.states.onOk(rest);
        }
      }
      if (e.data.actionType === 'cancel') {
        if (this.states.onCancel) {
          this.states.onCancel();
        }
      }
    });
    const {
      urlParams,
    }: { urlParams: Partial<IProps['urlParams']> & { [key: string]: any } } =
      props;
    let search = '';
    Object.keys(urlParams).forEach((key, index) => {
      if (!index) {
        /* 预发环境 */
        search = `https://zz-test05.pinming.org/material-sdk-h5/#/?${key}=${urlParams[key]}`;
        /** 测试环境 */
        // search = `${window.location.origin}/material-sdk-h5/#/?${key}=${urlParams[key]}`;
        /** 本地 */
        // search = `/#/?${key}=${urlParams[key]}`;
      } else {
        search = `${search}&${key}=${urlParams[key]}`;
      }
    });

    this.search = search;

    this.render();
  }
  render() {
    const d = h('iframe', {
      src: this.search,
      style: {
        width: '100%',
        height: '100%',
        border: 'none',
      },
    });
    render(d, this.states.container as any);
  }
}
