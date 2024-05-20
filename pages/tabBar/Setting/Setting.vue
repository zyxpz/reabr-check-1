<template>
	<view>
		<uni-notice-bar text="请在“设置”页，扫一扫绑定基石授权用户码" />
		<uni-notice-bar text="用户授权码失效，请重新绑定。" />
		<uni-notice-bar text="当前归属方未订阅此服务或订阅已到期。" />
		<uni-list :border="listBorder" class="bg">
			<uni-list-item class='uni-panel-h'>
				<template v-slot:header>
					<view class="slot-box slot-left">
						<text>设备码</text>
					</view>
				</template>
				<template v-slot:body>
					<text class="slot-box slot-text" ref="textToCopy">{{systemInfo.model}}</text>
				</template>
				<template v-slot:footer>
					<text @click="handleCopy" class='cus-a'>复制</text>
				</template>
			</uni-list-item>
			<uni-list-item class='uni-panel-h'>
				<template v-slot:header>
					<view class="slot-box slot-left">
						<text>基石租户</text>
					</view>
				</template>
				<template v-slot:body>
					<text class="slot-box slot-text" ref="attribute">{{tenantInfo.name}}</text>
				</template>
				<template v-slot:footer>
					<picker @change="changeTenant" :value="tenantIndex" :range="tenantList" range-key="name">
						<text class='cus-a'>切换</text>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item class='uni-panel-h'>
				<template v-slot:header>
					<view class="slot-box slot-left">
						<text>归属方</text>
					</view>
				</template>
				<template v-slot:body>
					<text class="slot-box slot-text" ref="attribute">{{attributeInfo.name}}</text>
				</template>
				<template v-slot:footer>
					<picker @change="changeAttribute" :value="attributeIndex" :range="attributeList" range-key="name">
						<text class='cus-a'>切换</text>
					</picker>
				</template>
			</uni-list-item>
			<uni-list-item class='uni-panel-h'>
				<template v-slot:header>
					<view class="slot-box slot-left">
						<text>用户</text>
					</view>
				</template>
				<template v-slot:body>
					<text class="slot-box slot-text" ref="attribute">{{attributeInfo.name}}</text>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/**
				 * list border
				 */
				listBorder: false,
				/**
				 * 设备信息
				 */
				systemInfo: {},
				/**
				 * 租户列表 
				 */
				tenantList: [{
					name: '租户1',
					id: 1
				}, {
					name: '租户2',
					id: 2
				}],
				/**
				 * 租户信息
				 */
				tenantInfo: {
					name: '租户2',
					id: 2
				},
				tenantIndex: 1,
				/**
				 * 归属方信息
				 */
				attributeList: [{
					name: '归属方1',
					id: 1
				}, {
					name: '归属方2',
					id: 2
				}],
				attributeInfo: {},
				attributeIndex: 0,
				/**
				 * 用户信息
				 */
				userInfo: {},
				classValue: '1-2',
				classDataTree: [{
						text: '一年级',
						value: '1-0',
						children: [{
								text: '1.1班',
								value: '1-1'
							},
							{
								text: '1.2班',
								value: '1-2'
							}
						]
					},
					{
						text: '二年级',
						value: '2-0',
						children: [{
								text: '2.1班',
								value: '2-1'
							},
							{
								text: '2.2班',
								value: '2-2'
							}
						]
					},
					{
						text: '三年级',
						value: '3-0',
						disable: true
					}
				]
			}
		},
		methods: {
			getSystemInfo() {
				uni.getSystemInfo({
					success: (res) => {
						this.systemInfo = res
					}
				})
			},
			handleCopy() {
				try {
					// 由于不能直接从 <text> 复制，我们使用 Clipboard API
					const text = this.systemInfo?.model;
					navigator.clipboard.writeText(text).then(() => {
						// 可选：反馈给用户已复制
						uni.showToast({
							duration: 1000,
							title: '复制成功！',
							icon: 'success'
						})
					}).catch(err => {
						uni.showToast({
							duration: 1000,
							title: '复制失败！',
						})
					});
				} catch (err) {
					console.error('复制文本时出错：', err);
				}
			},
			/**
			 * 切换租户
			 * @params e.target.value 选中的索引
			 */
			changeTenant(e) {
				const index = e.detail?.value;
				this.tenantIndex = index;
				this.tenantInfo = this.tenantList?.[index]
			},
			/**
			 * 切换归属方
			 */
			changeAttribute(e) {
				const index = e.detail?.value;
				this.attributeIndex = index;
				this.attributeInfo = this.attributeList?.[index]
			},

		},
		mounted() {
			this.getSystemInfo()
		}
	}
</script>

<style lang="scss">
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		font-size: 28rpx !important;
	}

	.slot-text {
		flex: 1;
		color: #999;
		margin: 0 16rpx;
	}

	.cus-a {
		font-size: 24rpx;
		color: #1677ff;
		cursor: pointer;
	}
</style>