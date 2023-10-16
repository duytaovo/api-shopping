const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  password_incorrect:
    "Mật khẩu có ít nhất 6 kí tự, gồm chữ hoa, chữ số và kí tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác",
};

const transError = {
  account_in_use: "Email này đã được sử dụng",
  account_removed:
    "Tài khoản này đã bị gỡ khỏi hệ thống, nếu thông tin không chính xác, vui lòng liên hệ với bộ phận hỗ trợ",
  account_not_active:
    "Tài khoản này chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản",
  account_undefined: "Tài khoản này không tồn tại",
};

const transSuccess = {
  userCreated(userEmail) {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email để kích hoạt tài khoản, xin cảm ơn!`;
  },
  account_actived: "Kích hoạt tài khoản thành công, bạn có thể đăng nhập",
};

const transMail = {
  subject: "Unlock Car: Kích hoạt tài khoản.",
  template(linkVerify) {
    return `
      <h2 style={{color:red}}>Unlock Car: Kích hoạt tài khoản.</h2>  
      <h2>Bạn nhận được mail này vì đã đăng ký tài khoản trên Unlock Car</h2>  
      <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản.</h3>
      <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>
      <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân trọng.</h4>
    `;
  },
  send_failed:
    "Có lỗi trong quá trình gửi email, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.",
};

module.exports.vi = {
  transError,
  transMail,
  transSuccess,
  transValidation,
};
