import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";

function BaseModal({
  title = "title",
  trigger = undefined,
  initiallyOpen = true,
  footerElements,
  children,
  actionButtonText = "Turpināt",
  showActionButton = true,
}) {
  const [isOpen, setIsOpen] = React.useState(initiallyOpen);

  React.useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);

  function handleCloseEvent() {
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {!!trigger && <AlertDialogTrigger className="w-[32px] h-[32px] rounded-full flex items-center justify-center">{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        handleMouseDownOnOverlay={handleCloseEvent}
        onEscapeKeyDown={handleCloseEvent}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {footerElements}
          {showActionButton && (
            <AlertDialogAction onClick={() => setIsOpen(false)}>
              {actionButtonText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BaseModal;
