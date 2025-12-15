import React from "react";
import { MAX_MISTAKES } from "../../../lib/constants";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import BaseModal from "../BaseModal";

function InfoModal() {
  return (
    <BaseModal
      title=""
      trigger={<Info className="mr-4" />}
      initiallyOpen={false}
      actionButtonText="Got It!"
    >
      <Tabs defaultValue="how-to-play">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="how-to-play">Kā spēlēt?</TabsTrigger>
        </TabsList>
        <TabsContent value="how-to-play">
          {" "}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Kāds ir spēles mērķis?</AccordionTrigger>
              <AccordionContent>
                Atrast četras grupas ar kartītēm (vārdiem, frāzēm, vārdkopām), kuras kaut kas saista.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Kā spēlēt?</AccordionTrigger>
              <AccordionContent>
                Pa vienai izvēlies četras kartītes un spied "Iesniegt", lai pārbaudītu, vai minējums ir pareizs. Pareiza minējuma gadījumā atklāsies konkrētās grupas saistība jeb kopīgais.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Cik reizes var minēt?</AccordionTrigger>
              <AccordionContent>
                {`Pieļaujot ${MAX_MISTAKES} kļūdas, spēle beidzas.`}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </BaseModal>
  );
}

export default InfoModal;
