# sm-did
### 开发文档
[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)

## 插件使用流程：

试用插件，选择该插件绑定的项目，导入插件到指定项目。
根据插件作者的提供的文档开发代码，在代码中引用插件，调用插件功能。
打包自定义基座，得到自定义基座，进行log输出测试。
开发完毕后，可购买插件，正式云打包。
UTS插件目前不支持离线打包。

# Android获取设备唯一标识（OAID、AAID、AndroidID、IMEI、GUID 、PseudoID等） 

## SM-DID简介

安卓设备唯一标识解决方案。 本插件提供了国内各大手机厂商获取 OAID（开放匿名设备标识）及海外手机平台获取 AAID（安卓广告标识）的便携接口， 另外也提供了 IMEI/MEID、AndroidID、WidevineID、PseudoID、GUID 等常见的设备标识的获取方法。

有建议和需要，请联系QQ：592121306



## 插件使用

在 `script` 中引入组件

```javascript
import * as ClientId from '@/uni_modules/sm-did';
```

```
<script>
	import * as ClientId from '@/uni_modules/sm-did';
	export default {
		data() {
			return {
				title: '设备唯一标识'
			}
		},
		mounted() {

		},
		onLoad() {
			this.register()
		},
		methods: {
			register() {
				ClientId.register({
					onSuccess: (id) => {
						this.title = `获取到的设备ID:${id}`
					}
				});
			},
			getDeviceId() {
				this.title = `获取到封装好的设备唯一ID:${ ClientId.getClientId()}`
			},
			getOAID() {
				this.title = `获取到的OAID:${ClientId.getOAID()}`
			},
			getOAIDAsync() {
				ClientId.getOAIDAsync({
					onSuccess: (id) => {
						this.title = `获取到的OAID:${id}`
					},
					onError: (ex) => {
						this.title = `获取OAID报错:${ex}`
					}
				});
			},
			getAll() {
				this.title = `获取到封装好的唯一标识:${ClientId.getClientId()}
							\n是否支持OAID:${ClientId.supportedOAID()}
							\n获取OAID:${ClientId.getOAID()}
							\n获取IMEI:${ClientId.getIMEI()}
							\n获取AndroidID:${ClientId.getAndroidID()}
							\n获取WidevineID:${ClientId.getWidevineID()}
							\n获取PseudoID:${ClientId.getPseudoID()}
							\n获取GUID:${ClientId.getGUID()}
							\n获取GUID:${ClientId.getGUID()}
				`
			}
		}
	}
</script>
```





## api 列表

|    方法名     |                             说明                             |
| :-----------: | :----------------------------------------------------------: |
|   register    | 必须先注册再获取，为了APP隐私合规，请在用户同意隐私政策后调用 |
|  getClientId  | 获取设备唯一ID，如没有自定义需求可直接调用。获取到的设备标识按照顺序返回，然后md5：IMEI/MEID ->  OAID/AAUD  -> AndroidID -> GUID -> PseudoID |
|    getOAID    | 异步获取设备的OAID（AAID）。同步调用getIdCodes获取OAID，第一次可能为空，可采用getOAID方法 |
| getOAIDAsync  |                  // 获取OAID/AAID，异步回调                  |
| supportedOAID |                     // 是否支持OAID/AAID                     |
|    getIMEI    | // 获取IMEI，只支持Android 10之前的系统，需要READ_PHONE_STATE权限，可能为空 |
|  getPseudoID  |  // 获取伪造ID，根据硬件信息生成，不会为空，有大概率会重复   |
|    getGUID    |               // 获取GUID，随机生成，不会为空                |
| getWidevineID | // 获取数字版权管理ID，可能为空。很鸡肋，在某些手机上还可能造成卡死或闪退，不建议使用 |



## 支持情况

| 厂商或品牌                        | 系统或框架                                              |
| --------------------------------- | ------------------------------------------------------- |
| 华为（Huawei、Honor）             | HMS Core 2.6.2+ 、Google Play Service 4.0+              |
| 小米（XiaoMi、Redmi、BlackShark） | MIUI 10.2+、Google Play Service 4.0+                    |
| 维沃（VIVO、IQOO）                | Funtouch OS 9+、OriginOS 1.0+、Google Play Service 4.0+ |
| 欧珀（OPPO、Realme）              | ColorOS 7.0+、Google Play Service 4.0+                  |
| 三星（Samsung）                   | Android 10+、Google Play Service 4.0+                   |
| 联想（Lenovo）                    | ZUI 11.4+、Google Play Service 4.0+                     |
| 华硕（ASUS）                      | Android 10+、Google Play Service 4.0+                   |
| 魅族（Meizu）                     | Android 10+、Google Play Service 4.0+                   |
| 一加（OnePlus）                   | Android 10+、Google Play Service 4.0+                   |
| 努比亚（Nubia）                   | Android 10+、Google Play Service 4.0+                   |
| 酷派（Coolpad）                   | CoolOS、Google Play Service 4.0+                        |
| 酷赛（Coosea ）                   | Android 10+、Google Play Service 4.0+                   |
| 卓易（Droi ）                     | Freeme OS、Google Play Service 4.0+                     |
| 其他（ZTE、HTC、Motorola、……）    | SSUI、Google Play Service 4.0+                          |





## 远程真机调试

- 免费 [华为远程真机云调试](https://developer.huawei.com/consumer/cn/agconnect/cloud-adjust) 。
- 免费 [小米云测平台远程真机租用](https://testit.miui.com/remote) 。
- 免费 [VIVO 云测平台远程真机](https://vcl.vivo.com.cn/#/machine/picking) 。
- 免费 [OPPO 云测平台远程真机](https://open.oppomobile.com/cloudmachine/device/list-plus) 。
- 免费 [三星远程开发测试平台真机调试](http://samsung.smarterapps.cn/index.php?app=home&mod=Index&act=samsung) 。
