<template>
  <div class="form-test">
    <div class="form-test__bd">
      <mp-form id="form" :rules="rules" v-models="formData">
        <mp-cells title="单选列表项">
          <mp-checkbox-group prop="radio" :multi="false" @change="radioChange">
            <mp-checkbox
              v-for="item in radioItems"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :checked="item.checked"
            ></mp-checkbox>
          </mp-checkbox-group>
        </mp-cells>
        <mp-cells title="复选列表项">
          <mp-checkbox-group prop="checkbox" :multi="true" @change="checkboxChange">
            <mp-checkbox
              v-for="item in checkboxItems"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :checked="item.checked"
            ></mp-checkbox>
          </mp-checkbox-group>
        </mp-cells>

        <mp-cells title="表单" footer="底部说明文字底部说明文字">
          <mp-cell prop="qq" title="qq" ext-class>
            <input v-model="formData.qq" class="weui-input" placeholder="请输入qq" />
          </mp-cell>
          <mp-cell prop="mobile" title="手机号" ext-class="weui-cell_vcode">
            <input v-model="formData.mobile" class="weui-input" placeholder="请输入手机号" />
            <div slot="footer" class="weui-vcode-btn">获取验证码</div>
          </mp-cell>
          <mp-cell prop="date" title="日期" ext-class>
            <picker :value="formData.date" mode="date" @change="bindDateChange">
              <div class="weui-input">{{ formData.date }}</div>
            </picker>
          </mp-cell>
          <mp-cell prop="vcode" title="验证码" ext-class="weui-cell_vcode">
            <input v-model="formData.vcode" class="weui-input" placeholder="请输入验证码" />
            <image
              slot="footer"
              class="weui-vcode-img"
              src="../images/vcode.jpg"
              style="width: 108px"
            />
          </mp-cell>
        </mp-cells>
        <mp-cells title="提交后表单项报错">
          <mp-cell show-error prop="idcard" title="卡号" link ext-class>
            <input v-model="formData.idcard" class="weui-input" placeholder="请输入卡号" />
          </mp-cell>
        </mp-cells>
      </mp-form>
      <div class="weui-btn-area">
        <button class="weui-btn" type="primary" @tap="submitForm">确定</button>
      </div>

      <mp-toptips :msg="error" type="error" :show="showTopTips"></mp-toptips>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTopTips: false,
      error: '',

      radioItems: [
        { name: 'cell standard', value: '0', checked: true },
        { name: 'cell standard', value: '1' }
      ],
      checkboxItems: [
        { name: 'standard is dealt for u.', value: '0', checked: true },
        { name: 'standard is dealicient for u.', value: '1' }
      ],
      formData: {
        date: ''
      },
      rules: [
        {
          name: 'radio',
          rules: { required: true, message: '单选列表是必选项' }
        },
        {
          name: 'checkbox',
          rules: { required: true, message: '多选列表是必选项' }
        },
        {
          name: 'qq',
          rules: { required: true, message: 'qq必填' }
        },
        {
          // 多个规则
          name: 'mobile',
          rules: [
            { required: true, message: 'mobile必填' },
            { mobile: true, message: 'mobile格式不对' }
          ]
        },
        {
          name: 'vcode',
          rules: { required: true, message: '验证码必填' }
        },
        {
          name: 'idcard',
          rules: { required: true, message: 'idcard必填' }
        }
      ]
    }
  },
  methods: {
    radioChange: function(e) {
      let radioItems = this.radioItems
      for (let i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value === e.mp.detail.value
      }

      this.radioItems = radioItems
      this[`formData.radio`] = e.mp.detail.value
    },
    checkboxChange: function(e) {
      let checkboxItems = this.checkboxItems
      let values = e.mp.detail.value
      for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false

        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (checkboxItems[i].value === values[j]) {
            checkboxItems[i].checked = true
            break
          }
        }
      }

      this.checkboxItems = checkboxItems
      this[`formData.checkbox`] = e.mp.detail.value
    },
    bindDateChange(e) {
      this.formData.date = e.mp.detail.value
    },
    submitForm() {
      this.$mp.page.selectComponent('#form').validate((valid, errors) => {
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.error = errors[firstError[0]].message
            this.showTopTips = true
          }
        } else {
          wx.showToast({
            title: '校验通过'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form-test {
  background: #f0f0f0;
}
</style>
