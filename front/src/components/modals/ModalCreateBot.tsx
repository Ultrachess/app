/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

//create a modal that takes in a trigger element and renders a modal with a form to create a bot
//then makes a CREATE_BOT action to the backend
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { blackA, green, mauve, violet } from "@radix-ui/colors";
import { Cross2Icon } from "@radix-ui/react-icons";
import { keyframes, styled } from "@stitches/react";
import React, { useState } from "react";
import { Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { TransactionType } from "../../common/types";
import { useActionCreator } from "../../state/game/hooks";
import { useAppSelector } from "../../state/hooks";
import { setDeployBotModal } from "../../state/ui/reducer";
import Button from "../ui/Button";
import Flex from "../ui/Flex";

export default () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const addAction = useActionCreator();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef(null);

  const showDeployBotModal = useAppSelector(
    (state) => state.ui.modal.showDeployBotModal
  );

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const dispatch = useDispatch();

  const handleSubmission = async () => {
    const file = selectedFile;
    const binary = new Uint8Array(await file.arrayBuffer());
    await addAction({
      type: TransactionType.DEPLOY_BOT_INPUT,
      binary: binary,
      name: "test",
    });
  };

  return (
    <Transition.Root show={showDeployBotModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setDeployBotModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Deploy bot
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Upload a file containing the bytecode of your bot. The
                          bytecode you upload must be compiled to RISCV and be a
                          UCI compliant chess engine
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-xs font-medium text-gray-700">
                      Drag and drop your RISC-V binary file here or click to
                      upload
                    </label>
                    <FileUploadBlock
                      onClick={() => inputRef.current.click()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (
                          e.dataTransfer.files &&
                          e.dataTransfer.files.length > 0
                        ) {
                          setSelectedFile(e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      {selectedFile ? selectedFile.name : "Upload file"}
                      <input
                        ref={inputRef}
                        style={{ display: "none" }}
                        type="file"
                        name="file"
                        onChange={changeHandler}
                      />
                    </FileUploadBlock>
                  </div>

                  <div className="mt-5"></div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      handleSubmission();
                      dispatch(setDeployBotModal(false));
                    }}
                  >
                    Deploy
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      dispatch(setDeployBotModal(false));
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  position: "absolute",
  top: 10,
  right: 10,

  "&:hover": { backgroundColor: violet.violet4 },
  "&:focus": { boxShadow: `0 0 0 2px ${violet.violet7}` },
});

const Label = styled("label", {
  fontSize: 13,
  lineHeight: 1,
  marginBottom: 10,
  color: violet.violet12,
  display: "block",
});

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 15,
});

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(Dialog.Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  "&:focus": { outline: "none" },
});

const DialogTitle = styled(Dialog.Title, {
  margin: 0,
  fontWeight: 500,
  color: mauve.mauve12,
  fontSize: 17,
});

const DialogDescription = styled(Dialog.Description, {
  margin: "10px 0 20px",
  color: mauve.mauve11,
  fontSize: 15,
  lineHeight: 1.5,
});

const FileUploadBlock = styled("div", {
  display: "block",
  border: `2px black dashed`,
  borderRadius: 4,
  fontSize: 15,
  userSelect: "none",
  padding: "45px 0",
  width: 300,
  textAlign: "center",
});

{
  /* <DialogTitle>Upload bot bytecode</DialogTitle>
          <DialogDescription>
            Upload a file containing the bytecode of your bot. The bytecode you
            upload must be compiled to RISCV and be a UCI compliant chess engine
          </DialogDescription>
          <Fieldset>
            <Label>Drag and drop your RISC-V executable</Label>
            <FileUploadBlock
              onClick={() => inputRef.current.click()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  setSelectedFile(e.dataTransfer.files[0]);
                }
              }}
            >
              {selectedFile ? selectedFile.name : "Upload file"}
              <input
                ref={inputRef}
                style={{ display: "none" }}
                type="file"
                name="file"
                onChange={changeHandler}
              />
            </FileUploadBlock>
          </Fieldset> */
}
