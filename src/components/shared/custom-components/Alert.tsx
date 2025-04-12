// CustomAlert.js
import swal from "sweetalert";

interface CustomAlertProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomDeleteAlert = ({ onConfirm, onCancel }: CustomAlertProps) => {
  return swal({
    title: "Are you sure to delete?",
    icon: "warning",
    buttons: {
      cancel: {
        text: "Cancel",
        value: false,
        visible: true,
        className: "btn btn-danger",
        closeModal: true,
      },
      confirm: {
        text: "Delete",
        value: true,
        visible: true,
        className: "btn btn-success",
        closeModal: true,
      },
    },
  }).then((willDelete) => {
    if (willDelete) {
      onConfirm();
    } else {
      onCancel();
    }
  });
};

export default CustomDeleteAlert;
