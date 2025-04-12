import Modal from "@/components/shared/custom-components/Modal";
import Image from "next/image";
import { useState } from "react";
import ClientRequisitionForm from "./ClientRequisitionForm/Requisition";
import { space_grotest } from "@/lib/fonts";

const RightSide = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="relative w-full overflow-hidden ">
      {/* <Image
        src="/topSection/bn-img2.jpg"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="rounded-full w-full mt-12"
      />
      <Image
        src="/topSection/bn-img1.jpg"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="rounded-full w-full h-1/2"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full bg-[#245DFF] flex justify-center items-center">
        <p className="text-7xl text-white">MRS</p>
      </div> */}

      <Image
        src="/mrs/top-right.png"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="rounded-md w-full my-6"
      />

      <button
        className={`bg-primary w-full uppercase md:w-fit md:text-[1.2rem] md:py-4 py-2 px-8 rounded-md md:rounded-[50px] text-white ${space_grotest.className} block md:hidden`}
        onClick={openModal}
      >
        Be Our Client
      </button>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <ClientRequisitionForm />
      </Modal>
    </div>
  );
};

export default RightSide;
