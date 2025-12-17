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
      actionButtonText="Sapratu!"
    >
      <Tabs defaultValue="how-to-play">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="how-to-play">Noteikumi</TabsTrigger>
          <TabsTrigger value="about">Par</TabsTrigger>
        </TabsList>

        <TabsContent value="how-to-play">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Kāds ir spēles mērķis?</AccordionTrigger>
              <AccordionContent>
                Atrast četras grupas ar kartītēm (vārdiem, frāzēm, vārdkopām),
                kuras kaut kas saista.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Kā spēlēt?</AccordionTrigger>
              <AccordionContent>
                Pa vienai izvēlies četras kartītes un spied "Iesniegt", lai
                pārbaudītu, vai minējums ir pareizs. Pareiza minējuma gadījumā
                atklāsies konkrētās grupas saistība jeb kopīgais.
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

        <TabsContent value="about">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="about-1">
              <AccordionTrigger>Par spēli</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Saistības ir vārdu loģikas spēle, iedvesmota no{" "}
                    <em>The New York Times</em> spēles{" "}
                    <a
                      href="https://www.nytimes.com/games/connections"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Connections
                    </a>
                    . Spēles mērķis ir atrast slēptās saistības starp vārdiem un sagrupēt tos četrās saistītās kategorijās.
                  </p>

                  <p>
                    Atšķirībā no oriģināla, Saistības balstās arī uz daudz lokālākām asociācijām — latviešu valodu, kultūru, vietvārdiem, idiomām un ikdienas kontekstu. Dažas saiknes būs acīmredzamas, citas - apzināti maldinošas, liekot domāt plašāk un uzmanīgāk.
                  </p>

                  <p>
                    Spēlē nav nepieciešamas specifiskas priekšzināšanas, bet valodas izjūta, vērīgums un pacietība noteikti noderēs. Katra līmeņa grūtība pieaug, un pēdējās saistības bieži vien atklājas tikai tad, kad šķiet, ka viss jau ir izmēģināts.
                  </p>

                  <p>
                    Saistību saturs:{" "}
                    <a
                      href="https://x.com/dw_immurs"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      @dw_immurs
                    </a>
                  </p>

                  <p>
                    Uzcelt Saistības palīdzēja:{" "}
                    <a
                      href="http://gsvalbe.id.lv/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Gustavs
                    </a>
                  </p>
                
                  <p>
  Oriģinālais kods: 
  
    href="https://github.com/and-computers/react-connections-game"
    target="_blank"
    rel="noreferrer"
    className="underline"
  >
    react-connections-game
  </a>
  {" "}(GPL v3 licence)
                  </p>
                        
                  <p>Veiksmi meklējot saistības!</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </BaseModal>
  );
}

export default InfoModal;
