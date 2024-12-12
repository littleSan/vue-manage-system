<template>
    <div class="container" style="width: 3000px;">
<!--        <el-radio-group class="mgb20" v-model="labelPosition">-->
<!--            <el-radio-button value="left">Left</el-radio-button>-->
<!--            <el-radio-button value="right">Right</el-radio-button>-->
<!--            <el-radio-button value="top">Top</el-radio-button>-->
<!--        </el-radio-group>-->
        <el-form ref="formRef" :rules="rules" :model="form" label-width="120px" :label-position="labelPosition" style="width: 100%">
            <el-row :gutter="100" style="width: 100%;">
                <el-col :span="10" style="width: 100%;">
                    <el-form-item label="公司名称" prop="name">
                        <el-input v-model="form.name"  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="英文名称" prop="enName">
                        <el-input v-model="form.enName" />
                    </el-form-item>
                    <el-form-item label="简介" prop="desc">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                   <el-form-item label="详细描述" prop="detail">
                        <el-input type="textarea" rows="5" v-model="form.detail"></el-input>
                    </el-form-item>
                    <el-form-item label="荣誉资质" prop="honor">
                         <el-upload v-if="form.honor.length !== 0"  class="avatar-uploader"
                                    action="/back/api/file/uploadLocal"
                                    list-type="picture-card"
                                    :file-list="form.honor"
                                   :on-success="handleAvatarSuccess">
                          	<el-icon class="el-icon-plus avatar-uploader-icon">
                              <Plus />
						                </el-icon>
                        </el-upload>
                    </el-form-item>
                   <el-form-item label="二维码" prop="qrCodeUrl">
                         <el-upload v-if="form.qrCodeUrl.length !== 0"  class="avatar-uploader"
                                    action="/back/api/file/uploadLocal"
                                    list-type="picture"
                                    :file-list="form.qrCodeUrl"
                                   :on-success="handleAvatarSuccess1">

                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
<!--                        <el-button @click="onReset(formRef)">重置表单</el-button>-->
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup lang="ts" name="forms">
import {onMounted, reactive, ref} from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormProps, FormRules } from 'element-plus';
import {companyInfo,updateCompanyInfo} from  '@/api/index'
import {CompanyItem} from "@/types/company";

const labelPosition = ref<FormProps['labelPosition']>('left')
const rules: FormRules = {
    name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
    name: '',
    enName: '',
    desc: '',
    detail:'',
    // honor: [{name:"",url:'https://dimei-med.com/uploadfile/basebase/ry1.jpg'},{name:"",url:'https://dimei-med.com/uploadfile/basebase/ry2.jpg'}],
    honor:[],
    qrCodeUrl:[]
});

//定义一个页面加载就执行的方法
onMounted(() => {
    getCompanyInfo();
});

// getCompanyInfo();
const getCompanyInfo = async () => {
 const res = await companyInfo({id:1})

  if (res.data.code !== 200200) {
    return ElMessage.error(res.data.msg);
  }
  form.name = res.data.data.name
  form.enName = res.data.data.enName
  form.desc = res.data.data.description
  form.detail = res.data.data.detail
  dealHonorArray(res);
  dealQrCodeArray(res);

  // console.log("form",form)
}
//处理honor 先由json 字符串转换成 ['a','b'] 在转换成 [}url:'a'},{url:'b'}]
const dealHonorArray = (res:any) => {
  let honorData = res.data.data.honor;
  console.log("honorData",honorData)
  if (typeof honorData === 'string') {
    try {
      honorData = JSON.parse(honorData);
    } catch (error) {
      console.error("Failed to parse honor as JSON:", error);
      honorData = [];
    }
  }
   // 检查 honor 是否为数组
  if (Array.isArray(honorData)) {
    form.honor = honorData.map((item: string) => {
      const fileName = item.split('/').pop(); // 提取文件名
      return { name: fileName || "", url: item };
    });
  } else {
    console.error("honor is not an array:", honorData);
    form.honor = []; // 如果不是数组，初始化为空数组
  }
}

//qrCode 转 数组
const dealQrCodeArray = (res:any) => {
  let honorData = res.data.data.qrCodeUrl;
  console.log("honorData",honorData)
  if (typeof honorData === 'string') {
    try {
      honorData = JSON.parse(honorData);
    } catch (error) {
      console.error("Failed to parse honor as JSON:", error);
      honorData = [];
    }
  }
   // 检查 honor 是否为数组
  form.qrCodeUrl = honorData;
}

const handleAvatarSuccess = (response: any, uploadFile: any, uploadFiles: any[]) => {
  console.log("uploadimage",response.data)
    if (typeof response.data === 'string') {
    const fileName = response.data.split('/').pop();
    const newFile = { name: fileName || 'default.jpg', url: "https://dimei-med.com"+ response.data };
    form.honor.push(newFile);
  } else {
    console.error("response.data.data is not a string:", response.data);
    ElMessage.error('上传的文件路径无效');
  }
  // const fileName = response.data.data.split('/').pop()
  // console.log("fileName", fileName)
  // const newFile = { name: "test" || 'default.jpg', url: response.data.data };
  // form.value.honor.push(newFile);
};
const handleAvatarSuccess1 = (response: any, uploadFile: any, uploadFiles: any[]) => {
   console.log("uploadimage",response.data)
    if (typeof response.data === 'string') {
    const fileName = response.data.split('/').pop();
    const newFile = { name: fileName || 'default.jpg', url: "https://dimei-med.com"+response.data };
    form.qrCodeUrl.push(newFile);
  } else {
    console.error("response.data.data is not a string:", response.data);
    ElMessage.error('上传的文件路径无效');
  }
  // console.log("uploadimage",response)
  //    const fileName = response.data.split('/').pop()
  // console.log("fileName", fileName)
  // const newFile = { name: fileName || 'default.jpg', url: response.data };
  // form.value.qrCodeUrl.push(newFile);
};
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log(form);
            //保存数据
            //  console.log("构造更新数据")
            //取出honer中的url 塞入list
            let honorlist:string[] = [];
             for (let i = 0; i < form.honor.length; i++) {
                 honorlist.push(form.honor[i].url)
             }
            console.log("构造更新数据list",honorlist)
            //处理qrCodeUrl 只要name 和 url 字段
            let qrCodeUrl = [];
             for (let i = 0; i < form.qrCodeUrl.length; i++) {
                 qrCodeUrl.push({name:form.qrCodeUrl[i].name,url:form.qrCodeUrl[i].url})
             }
            console.log("构造更新数据qrCodeUrl",qrCodeUrl)
            let params = {
                id:1,
                name:form.name,
                enName:form.enName,
                description:form.desc,
                detail:form.detail,
                honor:JSON.stringify(honorlist),
                qrCodeUrl:JSON.stringify(qrCodeUrl)
            }
            console.log("构造更新数据",params)
            updateCompanyInfo(params)
            ElMessage.success('提交成功！');
            getCompanyInfo()
        } else {
            return false;
        }
    });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>
