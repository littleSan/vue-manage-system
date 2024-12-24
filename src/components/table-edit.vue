<template>
	<el-form ref="formRef" :model="form" :rules="rules" :label-width="options.labelWidth">
		<el-row>
			<el-col :span="options.span" v-for="item in options.list">
				<el-form-item :label="item.label" :prop="item.prop">
					<!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
					<el-input v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled"
						:placeholder="item.placeholder" clearable></el-input>
					<el-input-number v-else-if="item.type === 'number'" v-model="form[item.prop]"
						:disabled="item.disabled" controls-position="right"></el-input-number>
					<el-select v-else-if="item.type === 'select'" v-model="form[item.prop]" :disabled="item.disabled"
						:placeholder="item.placeholder" clearable>
						<el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
					</el-select>
					<el-date-picker v-else-if="item.type === 'date'" type="date" v-model="form[item.prop]"
						:value-format="item.format"></el-date-picker>
					<el-switch v-else-if="item.type === 'switch'" v-model="form[item.prop]"
						:active-value="item.activeValue" :inactive-value="item.inactiveValue"
						:active-text="item.activeText" :inactive-text="item.inactiveText"></el-switch>
					<el-upload v-else-if="item.type === 'upload'" class="avatar-uploader"
                      action="/back/api/file/uploadLocal"
						:show-file-list="false" :on-success="handleAvatarSuccess">
<!--						<img v-if="form[item.prop]" :src="form[item.prop]" class="avatar" />-->
            <img v-if="isImage(form[item.prop])" :src="form[item.prop]" class="avatar" />
            <video v-else-if="isVideo(form[item.prop])" width="320" height="240" controls>
                <source :src="form[item.prop]" type="video/mp4" />
            </video>
						<el-icon v-else class="avatar-uploader-icon">
							<Plus />
						</el-icon>
					</el-upload>

          <el-upload v-else-if="item.type === 'videosUpload'" class="avatar-uploader"
                      action="/back/api/file/uploadLocal"
                      :on-progress="handleProgress"
                     :on-change="handleProgress"
						:show-file-list="false" :on-success="handleAvatarSuccess1">
<!--						<img v-if="form[item.prop]" :src="form[item.prop]" class="avatar" />-->
            <img v-if="isImage(form[item.prop])" :src="form[item.prop]" class="avatar" />
            <video v-else-if="isVideo(form[item.prop])" width="320" height="240" controls>
                <source :src="form[item.prop]" type="video/mp4" />
            </video>

						<el-icon v-else class="avatar-uploader-icon">
							<Plus />
						</el-icon>
             <el-progress v-if="progressVisible" :percentage="progressPercent" style="margin-top: 10px;"></el-progress>
					</el-upload>




<!--            <div v-else-if="item.type === 'editor'" style="border: 1px solid #ccc; margin-bottom: 10px">-->
<!--                <Toolbar-->
<!--                     style="border-bottom: 1px solid #ccc"-->
<!--                     :editor="editorRef"-->
<!--                     :defaultConfig="toolbarConfig" />-->
<!--               <Editor-->
<!--                style="height: 500px; overflow-y: hidden"-->
<!--                v-model="valueHtml"-->
<!--                :defaultConfig="editorConfig"-->
<!--                @onCreated="handleCreated"-->
<!--               />-->
<!--            </div>-->


					<slot :name="item.prop" v-else>

					</slot>
				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { FormOption } from '@/types/form-option';
import { FormInstance, FormRules, UploadProps } from 'element-plus';
import { PropType, ref } from 'vue';

// import '@wangeditor/editor/dist/css/style.css'; // 引入 css
// import { onBeforeUnmount, reactive, shallowRef, onMounted } from 'vue';
// import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const { options, formData, edit, update } = defineProps({
	options: {
		type: Object as PropType<FormOption>,
		required: true
	},
	formData: {
		type: Object,
		required: true
	},
	edit: {
		type: Boolean,
		required: false
	},
	update: {
		type: Function,
		required: true
	}
});


const form = ref({ ...(edit ? formData : {}) });

const rules: FormRules = options.list.map(item => {
	if (item.required) {
		return { [item.prop]: [{ required: true, message: `${item.label}不能为空`, trigger: 'blur' }] };
	}
	return {};
}).reduce((acc, cur) => ({ ...acc, ...cur }), {});

const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		update(form.value);
	});
};

const isImage = ( url )=> {
        return url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'));
    };
const isVideo= (url) =>{
        return url && (url.endsWith('.mp4') || url.endsWith('.avi') || url.endsWith('.mov'));
    };

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	// form.value.image = URL.createObjectURL(uploadFile.raw!);
	// form.value.url = URL.createObjectURL(uploadFile.raw!);
  console.log("rrrrr",response)
  form.value.image ="https://manage.dimei-med.com"+ response.data;
  console.log("form.value.image",form.value.image)
  form.value.url = "https://manage.dimei-med.com"+ response.data;
};

const progressVisible = ref(false);
const progressPercent = ref(0);
const handleProgress: UploadProps['onProgress'] = (event) => {
  progressVisible.value = true;
  progressPercent.value = Math.floor((event.loaded / event.total) * 100);
  setTimeout(() => {
    progressVisible.value = false;
    progressPercent.value = 0;
  }, 1000);
};
const handleAvatarSuccess1: UploadProps['onSuccess'] = async (response, uploadFile) => {

  console.log("ai",response)
  if(isVideo(response.data)){
       form.value.url = "https://manage.dimei-med.com"+ response.data;

       console.log("form.value.url",form.value.url)
  }else if (isImage(response.data)){
     form.value.coverUrl ="https://manage.dimei-med.com"+ response.data;
  }
};


//编辑器
//编辑器
// const editorRef = shallowRef();
// // 内容 HTML
// const valueHtml = ref('<p>hello</p>');
//
// // 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
//     }, 1500);
// });
//
// const toolbarConfig = {};
// const editorConfig = { placeholder: '请输入内容...' };
//
// // 组件销毁时，也及时销毁编辑器
// onBeforeUnmount(() => {
//     const editor = editorRef.value;
//     if (editor == null) return;
//     editor.destroy();
// });
//
// const handleCreated = (editor: any) => {
//     editorRef.value = editor; // 记录 editor 实例，重要！
// };


</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar {
  width: 100%;
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
