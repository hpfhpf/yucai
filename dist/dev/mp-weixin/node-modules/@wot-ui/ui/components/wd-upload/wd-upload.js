"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdIcon + wdLoading)();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const wdLoading = () => "../wd-loading/wd-loading.js";
const __default__ = {
  name: "wd-upload",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.uploadProps,
  emits: ["fail", "change", "success", "progress", "oversize", "chooseerror", "remove", "update:fileList"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    __expose({
      submit: () => startUploadFiles(),
      abort: () => abort()
    });
    const { translate } = common_vendor.useTranslate("upload");
    const uploadFiles = common_vendor.ref([]);
    const showUpload = common_vendor.computed(() => !props.limit || uploadFiles.value.length < props.limit);
    const videoPreviewId = common_vendor.ref(`videoPreview${common_vendor.uuid()}`);
    common_vendor.useVideoPreview(videoPreviewId.value);
    const { startUpload, abort, chooseFile, UPLOAD_STATUS } = common_vendor.useUpload();
    common_vendor.watch(
      () => props.fileList,
      (val) => {
        const { statusKey } = props;
        if (common_vendor.isEqual(val, uploadFiles.value))
          return;
        const uploadFileList = val.map((item) => {
          item[statusKey] = item[statusKey] || "success";
          item.response = item.response || "";
          return { ...item, uid: common_vendor.context.id++ };
        });
        uploadFiles.value = uploadFileList;
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.watch(
      () => props.limit,
      (val) => {
        if (val && val < uploadFiles.value.length) {
          console.error("[wot-design]Error: props limit must less than fileList.length");
        }
      },
      {
        deep: true,
        immediate: true
      }
    );
    function emitFileList() {
      emit("update:fileList", uploadFiles.value);
    }
    function startUploadFiles() {
      const { buildFormData, formData = {}, statusKey } = props;
      const { action, name, header = {}, accept, successStatus, uploadMethod } = props;
      const statusCode = common_vendor.isDef(successStatus) ? successStatus : 200;
      for (const uploadFile of uploadFiles.value) {
        if (uploadFile[statusKey] === UPLOAD_STATUS.PENDING) {
          if (buildFormData) {
            const res = buildFormData({ file: uploadFile, formData });
            if (common_vendor.isPromise(res)) {
              res.then((newFormData) => {
                if (newFormData) {
                  startUpload(uploadFile, {
                    action,
                    header,
                    name,
                    formData: newFormData,
                    fileType: accept,
                    statusCode,
                    statusKey,
                    uploadMethod,
                    onSuccess: handleSuccess,
                    onError: handleError,
                    onProgress: handleProgress
                  });
                }
              }).catch(() => {
              });
            } else if (res) {
              startUpload(uploadFile, {
                action,
                header,
                name,
                formData: res,
                fileType: accept,
                statusCode,
                statusKey,
                uploadMethod,
                onSuccess: handleSuccess,
                onError: handleError,
                onProgress: handleProgress
              });
            }
          } else {
            startUpload(uploadFile, {
              action,
              header,
              name,
              formData,
              fileType: accept,
              statusCode,
              statusKey,
              uploadMethod,
              onSuccess: handleSuccess,
              onError: handleError,
              onProgress: handleProgress
            });
          }
        }
      }
    }
    function getImageInfo(img) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getImageInfo({
          src: img,
          success: (res) => {
            resolve(res);
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
    }
    function initFile(file, currentIndex) {
      const { statusKey } = props;
      const initState = {
        uid: common_vendor.context.id++,
        // 仅h5支持 name
        name: file.name || "",
        thumb: file.thumb || "",
        [statusKey]: "pending",
        size: file.size || 0,
        url: file.path,
        percent: 0
      };
      if (typeof currentIndex === "number") {
        uploadFiles.value.splice(currentIndex, 1, initState);
      } else {
        uploadFiles.value.push(initState);
      }
      if (props.autoUpload) {
        startUploadFiles();
      }
    }
    function handleError(err, file, formData) {
      const { statusKey } = props;
      const index = uploadFiles.value.findIndex((item) => item.uid === file.uid);
      if (index > -1) {
        uploadFiles.value[index][statusKey] = "fail";
        uploadFiles.value[index].error = err.message;
        uploadFiles.value[index].response = err;
        emit("fail", { error: err, file, formData });
        emitFileList();
      }
    }
    function handleSuccess(res, file, formData) {
      const { statusKey } = props;
      const index = uploadFiles.value.findIndex((item) => item.uid === file.uid);
      if (index > -1) {
        uploadFiles.value[index][statusKey] = "success";
        uploadFiles.value[index].response = res.data;
        emit("change", { fileList: uploadFiles.value });
        emit("success", { file, fileList: uploadFiles.value, formData });
        emitFileList();
      }
    }
    function handleProgress(res, file) {
      const index = uploadFiles.value.findIndex((item) => item.uid === file.uid);
      if (index > -1) {
        uploadFiles.value[index].percent = res.progress;
        emit("progress", { response: res, file });
      }
    }
    function onChooseFile(currentIndex) {
      const { multiple, maxSize, accept, sizeType, limit, sourceType, compressed, maxDuration, camera, beforeUpload, extension } = props;
      chooseFile({
        multiple: common_vendor.isDef(currentIndex) ? false : multiple,
        sizeType,
        sourceType,
        maxCount: limit ? limit - uploadFiles.value.length : limit,
        accept,
        compressed,
        maxDuration,
        camera,
        extension
      }).then((res) => {
        let files = res;
        if (!multiple) {
          files = files.slice(0, 1);
        }
        const mapFiles = async (files2) => {
          for (let index = 0; index < files2.length; index++) {
            const file = files2[index];
            if (file.type === "image" && !file.size) {
              const imageInfo = await getImageInfo(file.path);
              file.size = imageInfo.width * imageInfo.height;
            }
            Number(file.size) <= maxSize ? initFile(file, currentIndex) : emit("oversize", { file });
          }
        };
        common_vendor.callInterceptor(beforeUpload, {
          args: [{ files, fileList: uploadFiles.value }],
          done: () => mapFiles(files)
        });
      }).catch((error) => {
        emit("chooseerror", { error });
      });
    }
    function onEvokeClick() {
      handleChoose();
    }
    function handleChoose(index) {
      if (props.disabled)
        return;
      const { beforeChoose } = props;
      common_vendor.callInterceptor(beforeChoose, {
        args: [{ fileList: uploadFiles.value }],
        done: () => onChooseFile(index)
      });
    }
    function handleRemove(file) {
      uploadFiles.value.splice(
        uploadFiles.value.findIndex((item) => item.uid === file.uid),
        1
      );
      emit("change", {
        fileList: uploadFiles.value
      });
      emit("remove", { file });
      emitFileList();
    }
    function removeFile(index) {
      const { beforeRemove } = props;
      const intIndex = index;
      const file = uploadFiles.value[intIndex];
      common_vendor.callInterceptor(beforeRemove, {
        args: [{ file, index: intIndex, fileList: uploadFiles.value }],
        done: () => handleRemove(file)
      });
    }
    function handlePreviewFile(file) {
      common_vendor.index.openDocument({
        filePath: file.url,
        showMenu: true
      });
    }
    function handlePreviewImage(index, lists) {
      const { onPreviewFail } = props;
      common_vendor.index.previewImage({
        urls: lists,
        current: lists[index],
        fail() {
          if (onPreviewFail) {
            onPreviewFail({
              index,
              imgList: lists
            });
          } else {
            common_vendor.index.showToast({ title: "预览图片失败", icon: "none" });
          }
        }
      });
    }
    function handlePreviewVieo(index, lists) {
      const { onPreviewFail } = props;
      common_vendor.index.previewMedia({
        current: index,
        sources: lists.map((file) => {
          return {
            url: file.url,
            type: "video",
            poster: file.thumb
          };
        }),
        fail() {
          if (onPreviewFail) {
            onPreviewFail({
              index,
              imgList: []
            });
          } else {
            common_vendor.index.showToast({ title: "预览视频失败", icon: "none" });
          }
        }
      });
    }
    function onPreviewImage(file) {
      const { beforePreview, reupload } = props;
      const fileList = common_vendor.deepClone(uploadFiles.value);
      const index = fileList.findIndex((item) => item.url === file.url);
      const imgList = fileList.filter((file2) => isImage(file2)).map((file2) => file2.url);
      const imgIndex = imgList.findIndex((item) => item === file.url);
      if (reupload) {
        handleChoose(index);
      } else {
        common_vendor.callInterceptor(beforePreview, {
          args: [{ file, index, fileList, imgList }],
          done: () => handlePreviewImage(imgIndex, imgList)
        });
      }
    }
    function onPreviewVideo(file) {
      const { beforePreview, reupload } = props;
      const fileList = common_vendor.deepClone(uploadFiles.value);
      const index = fileList.findIndex((item) => item.url === file.url);
      const videoList = fileList.filter((file2) => isVideo(file2));
      const videoIndex = videoList.findIndex((item) => item.url === file.url);
      if (reupload) {
        handleChoose(index);
      } else {
        common_vendor.callInterceptor(beforePreview, {
          args: [{ file, index, fileList, imgList: [] }],
          done: () => handlePreviewVieo(videoIndex, videoList)
        });
      }
    }
    function onPreviewFile(file) {
      const { beforePreview, reupload } = props;
      const fileList = common_vendor.deepClone(uploadFiles.value);
      const index = fileList.findIndex((item) => item.url === file.url);
      if (reupload) {
        handleChoose(index);
      } else {
        common_vendor.callInterceptor(beforePreview, {
          args: [{ file, index, fileList, imgList: [] }],
          done: () => handlePreviewFile(file)
        });
      }
    }
    function isVideo(file) {
      return file.name && common_vendor.isVideoUrl(file.name) || common_vendor.isVideoUrl(file.url);
    }
    function isImage(file) {
      return file.name && common_vendor.isImageUrl(file.name) || common_vendor.isImageUrl(file.url);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(uploadFiles.value, (file, index, i0) => {
          return common_vendor.e({
            a: isImage(file)
          }, isImage(file) ? {
            b: file.url,
            c: _ctx.imageMode,
            d: common_vendor.o(($event) => onPreviewImage(file), index)
          } : isVideo(file) ? common_vendor.e({
            f: file.thumb
          }, file.thumb ? {
            g: file.thumb,
            h: _ctx.imageMode,
            i: "42f2fa66-0-" + i0,
            j: common_vendor.p({
              name: "play-circle-fill",
              ["custom-class"]: "wd-upload__video-play"
            }),
            k: common_vendor.o(($event) => onPreviewVideo(file), index)
          } : {
            l: file.url,
            m: file.name || "视频" + index,
            n: file.thumb,
            o: "42f2fa66-1-" + i0,
            p: common_vendor.p({
              name: "play-circle-fill",
              ["custom-class"]: "wd-upload__video-play"
            }),
            q: common_vendor.o(($event) => onPreviewVideo(file), index)
          }) : {
            r: "42f2fa66-2-" + i0,
            s: common_vendor.p({
              name: "file",
              ["custom-class"]: "wd-upload__file-icon"
            }),
            t: common_vendor.t(file.name || file.url),
            v: common_vendor.o(($event) => onPreviewFile(file), index)
          }, {
            e: isVideo(file),
            w: file[props.statusKey] !== "success"
          }, file[props.statusKey] !== "success" ? common_vendor.e({
            x: file[props.statusKey] === "loading"
          }, file[props.statusKey] === "loading" ? {
            y: "42f2fa66-3-" + i0,
            z: common_vendor.p({
              type: _ctx.loadingType,
              size: _ctx.loadingSize,
              color: _ctx.loadingColor
            }),
            A: common_vendor.t(file.percent)
          } : {}, {
            B: file[props.statusKey] === "fail"
          }, file[props.statusKey] === "fail" ? {
            C: "42f2fa66-4-" + i0,
            D: common_vendor.p({
              name: "close-circle",
              ["custom-class"]: "wd-upload__icon"
            }),
            E: common_vendor.t(file.error || common_vendor.unref(translate)("error"))
          } : {}) : {}, {
            F: file[props.statusKey] !== "loading" && !_ctx.disabled
          }, file[props.statusKey] !== "loading" && !_ctx.disabled ? {
            G: "42f2fa66-5-" + i0,
            H: common_vendor.p({
              name: "close",
              ["custom-class"]: "wd-upload__close-icon"
            }),
            I: common_vendor.o(($event) => removeFile(index), index)
          } : {}, _ctx.$slots["preview-cover"] ? {
            J: "preview-cover-" + i0,
            K: common_vendor.r("preview-cover", {
              file,
              index
            }, i0)
          } : {}, {
            L: index
          });
        }),
        b: _ctx.$slots["preview-cover"],
        c: common_vendor.n(_ctx.customPreviewClass),
        d: showUpload.value
      }, showUpload.value ? common_vendor.e({
        e: _ctx.$slots.default
      }, _ctx.$slots.default ? {
        f: common_vendor.n(_ctx.customEvokeClass),
        g: common_vendor.o(onEvokeClick, "59")
      } : common_vendor.e({
        h: common_vendor.p({
          ["custom-class"]: "wd-upload__evoke-icon",
          name: "camera-fill"
        }),
        i: _ctx.limit && _ctx.showLimitNum
      }, _ctx.limit && _ctx.showLimitNum ? {
        j: common_vendor.t(uploadFiles.value.length),
        k: common_vendor.t(_ctx.limit)
      } : {}, {
        l: common_vendor.o(onEvokeClick, "80"),
        m: common_vendor.n(_ctx.disabled ? "is-disabled" : ""),
        n: common_vendor.n(_ctx.customEvokeClass)
      })) : {}, {
        o: common_vendor.n(_ctx.customClass),
        p: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
