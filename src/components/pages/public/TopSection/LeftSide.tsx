import { space_grotest } from "@/lib/fonts";
import { useState } from "react";
import ClientRequisitionForm from "./ClientRequisitionForm/Requisition";
import Modal from "@/components/shared/custom-components/Modal";

const LeftSide = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="text-white h-full overflow-hidden">
      <div className="flex flex-col md:gap-y-10 gap-y-4 h-full justify-center">
        <p
          className={`md:text-3xl text-xl text-black font-semibold mt-5 ${space_grotest.className}`}
        >
          We believe meaningful, sustainable employment has the power to change
          the world. Because when you combine talented people with innovative
          companies, you can build a brighter future for everyone.
        </p>

        <button
          className={`bg-primary uppercase md:w-fit md:text-[1.2rem] md:py-4 py-2 px-8 rounded-md md:rounded-[50px] text-white ${space_grotest.className} hidden md:block`}
          onClick={openModal}
        >
          Be Our Client
        </button>
      </div>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <ClientRequisitionForm />
      </Modal>
    </div>
  );
};

export default LeftSide;
