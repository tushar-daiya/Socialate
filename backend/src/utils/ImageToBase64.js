async function convertImageToBase64(file) {
  const b64=file.buffer.toString("base64");
  let imgSrcString=`data:${file.mimetype};base64,${b64}`;
  return {imgSrcString, b64};
}

export { convertImageToBase64 };