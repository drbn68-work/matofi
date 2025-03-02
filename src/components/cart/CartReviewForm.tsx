import React from "react";
import { CartReviewFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";

// Array completo de centros de coste
const costCenters = [
  { value: "1100", label: "1100 - PATRONAT" },
  { value: "1200", label: "1200 - DIRECCIÓ GENERAL - SECRETARIA DIRECCIÓ" },
  { value: "1300", label: "1300 - DIRECCIÓ ACTIVITATS BÀSIQUES" },
  { value: "2100", label: "2100 - SERVEI D'UROLOGIA" },
  { value: "2121", label: "2121 - GAB. D'URO-ENDO-LAPAROSCÒPIA" },
  { value: "2122", label: "2122 - GAB. D'URODINÀMIA" },
  { value: "2131", label: "2131 - UNITAT D'URO-ONCOLOGIA" },
  { value: "2132", label: "2132 - UNITAT D'URO GENERAL I RECONSTRUCTIVA" },
  { value: "2133", label: "2133 - UNITAT D'URO FUNCIONAL" },
  { value: "2134", label: "2134 - UNITAT D'URO PEDIATRIA" },
  { value: "2135", label: "2135 - UNITAT D'URO LITIASI" },
  { value: "2200", label: "2200 - SERVEI DE NEFROLOGIA" },
  { value: "2221", label: "2221 - GAB. HOSPITAL DE DIA NEFROLÒGIC" },
  { value: "2222", label: "2222 - GAB. D'HEMODIÀLISI" },
  { value: "2223", label: "2223 - GAB. D'HIPERTENSIÓ (ELECTROS)" },
  { value: "2224", label: "2224 - GAB. PERITONEAL" },
  { value: "2225", label: "2225 - GAB. HEMODIÀLISI DOMICILIÀRIA" },
  { value: "2231", label: "2231 - UNITAT DE DIMARE" },
  { value: "2232", label: "2232 - UNITAT CLINICA DE TR" },
  { value: "2233", label: "2233 - UNITAT DE DIÀLISI CLINICA (CEXT)" },
  { value: "2300", label: "2300 - SERVEI D'ANDROLOGIA" },
  { value: "2321", label: "2321 - GAB. D'ESTUDIS ANDROLÒGICS" },
  { value: "2400", label: "2400 - PSICOLOGIA CLÍNICA" },
  { value: "2500", label: "2500 - ANESTESIOLOGIA" },
  { value: "2600", label: "2600 - RADIOLOGIA" },
  { value: "2700", label: "2700 - LABORATORI" },
  { value: "2721", label: "2721 - GAB. OBTENCIÓ DE MOSTRES" },
  { value: "2731", label: "2731 - ANATOMIA PATOLÒGICA" },
  { value: "2732", label: "2732 - BIOQUÍMICA" },
  { value: "2733", label: "2733 - HEMATOLOGIA" },
  { value: "2734", label: "2734 - BANC DE SANG" },
  { value: "2735", label: "2735 - MICROBIOLOGIA" },
  { value: "2736", label: "2736 - GENÈTICA" },
  { value: "2738", label: "2738 - CÀLCUL RENAL" },
  { value: "2739", label: "2739 - SEMINOLOGIA" },
  { value: "2740", label: "2740 - EMBRIOLOGIA i BANC DE CRIOPRESERVACIÓ" },
  { value: "2810", label: "2810 - SERVEI DE REPRODUCCIÓ ASSISTIDA" },
  { value: "2820", label: "2820 - EQUIP DE CIRUGIA VASCULAR" },
  { value: "2830", label: "2830 - EQUIP DE CARDIOLOGIA" },
  { value: "2850", label: "2850 - ACTIVITAT EQUIPS EXTERNS" },
  { value: "2900", label: "2900 - DUE (CEP)" },
  { value: "2910", label: "2910 - ACTIVITAT AMBULATÒRIA D'INFERMERIA" },
  { value: "2920", label: "2920 - GAB. CURES I SONDES" },
  { value: "3111", label: "3111 - DUE (CEP-IUNA)" },
  { value: "3112", label: "3112 - URGÈNCIES (CAU-IUNA)" },
  { value: "3131", label: "3131 - U.H.- 1.2." },
  { value: "3132", label: "3132 - U.H.- 1.3." },
  { value: "3133", label: "3133 - U.H.- 3.1." },
  { value: "3134", label: "3134 - U.H.- 3.3." },
  { value: "3141", label: "3141 - CENTRAL D'ESTERILITZACIÓ" },
  { value: "3142", label: "3142 - QUIRÒFAN" },
  { value: "3143", label: "3143 - SAL. OPERACIONS QUIR." },
  { value: "3144", label: "3144 - ZONA RECUPERACIÓ QUI" },
  { value: "3145", label: "3145 - UCIPO" },
  { value: "3146", label: "3146 - QUIRÒFAN R" },
  { value: "3147", label: "3147 - UNITAT D'INGRES I CMA" },
  { value: "3200", label: "3200 - ADMISSIONS I RECEPCIÓ" },
  { value: "3211", label: "3211 - RECEPCIÓ CONSULTA EXTERNA IUNA" },
  { value: "3212", label: "3212 - RECEPCIÓ CAU - URGÈNCIES" },
  { value: "3213", label: "3213 - RECEPCIÓ LABORATORI" },
  { value: "3214", label: "3214 - RECEPCIÓ GABINETS (1A CLÍNICA)" },
  { value: "3215", label: "3215 - RECEPCIÓ PSICOLOGIA" },
  { value: "3217", label: "3217 - RECEPCIÓ RADIOLOGIA" },
  { value: "3218", label: "3218 - RECEPCIÓ DIÀLISIS-NEFROLOGIA" },
  { value: "3219", label: "3219 - RECEPCIÓ HOSPITALITZACIÓ" },
  { value: "3220", label: "3220 - FARMACIA" },
  { value: "3230", label: "3230 - DOCUMENTACIÓ MÈDICA" },
  { value: "3234", label: "3234 - BIBLIOTECA" },
  { value: "3235", label: "3235 - AUDIOVISUALS" },
  { value: "5520", label: "5520 - QUALITAT" },
  { value: "5530", label: "5530 - RECERCA" },
  { value: "5540", label: "5540 - DOCÈNCIA" },
  { value: "5550", label: "5550 - AGÈNCIA DE GESTIÓ DEL CONEIXEMENT" },
  { value: "1400", label: "1400 - DIRECCIÓ ACTIVITATS COMPLEMENTÀRIES" },
  { value: "4000", label: "4000 - DIRECCIÓ ECONÒMICA-FINANCERA" },
  { value: "4110", label: "4110 - SERVEIS GENERALS" },
  { value: "4112", label: "4112 - SERVEI DE RECEPCIÓ I CENTRALETA" },
  { value: "4121", label: "4121 - SERVEI D'ALIMENTACIÓ" },
  { value: "4125", label: "4125 - SERVEIS DE NETEJA" },
  { value: "4127", label: "4127 - SERVEI DE SEGURETAT" },
  { value: "4128", label: "4128 - SERVEI DE LOGÍSTICA" },
  { value: "4210", label: "4210 - FACTURACIÓ I CAIXA" },
  { value: "4220", label: "4220 - MAGATZEM I COMPRES" },
  { value: "4320", label: "4320 - INFRAESTRUCTURES I MANTENIMENT" },
  { value: "5110", label: "5110 - ANÀLISI DE GESTIÓ I PRESSUPOST" },
  { value: "5120", label: "5120 - COMPTABILITAT GENERAL I ANALÍTICA" },
  { value: "5130", label: "5130 - EXP. PACIENT PRIVAT" },
  { value: "5200", label: "5200 - TECNOLOGIA DE LA INFORMACIÓ I LA COMUNICACIÓ (TIC)" },
  { value: "5300", label: "5300 - GESTIÓ DE PERSONES" },
  { value: "5310", label: "5310 - RISCOS LABORALS" },
  { value: "5320", label: "5320 - COMITÉ D'EMPRESA" },
  { value: "5410", label: "5410 - ATENCIÓ AL CLIENT" },
  { value: "5420", label: "5420 - SERVEI DE SECRETARIA GENERAL" },
  { value: "5430", label: "5430 - COMUNICACIÓ I IMATGE" },
  { value: "6000", label: "6000 - PRIVATS" },
  { value: "3113", label: "3113 - CEP (DUE-CUNA)" },
  { value: "3135", label: "3135 - U.H.- 3.4." },
  { value: "3216", label: "3216 - RECEPCIÓ I ADMISSIONS PRIVATS (CUNA)" },
  { value: "8100", label: "8100 - EDIFICI CLÍNICA" },
  { value: "8200", label: "8200 - EDIFICI HOSPITAL" },
  { value: "8300", label: "8300 - EDIFICI TRIANGLE" },
  { value: "8500", label: "8500 - SANT CAROLINA 81" },
  { value: "8600", label: "8600 - LLORENÇ I BARBA" },
  { value: "9998", label: "9998 - DESPESES GENERAL PRIVATS" },
  { value: "9999", label: "9999 - DESPESES ESTRUCTURALS" },
];

export const CartReviewForm = ({
  items,
  userInfo,
  deliveryLocation,
  comments,
  onRemove,
  onSubmit,
  onDeliveryLocationChange,
  onCommentsChange,
  onUpdateQuantity,
  onCostCenterChange,
}: CartReviewFormProps) => {
  // Función para obtener el label completo a partir del valor
  const getCostCenterLabel = (value: string) => {
    const found = costCenters.find((cc) => cc.value === value);
    return found ? found.label : value;
  };

  // Cuando el usuario cambia el campo, se actualiza con el label completo
  const handleCostCenterChange = (value: string) => {
    const formatted = getCostCenterLabel(value);
    onCostCenterChange(formatted);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informació de l'usuari</h3>

          {/* Mostrar datos del usuario */}
          <p className="text-sm text-gray-700">
            <strong>Usuari (username):</strong> {userInfo.username}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Nom complet:</strong> {userInfo.fullName}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Departament:</strong> {userInfo.department}
          </p>
          {/* Correu electrònic debajo de Departament */}
          <p className="text-sm text-gray-700">
            <strong>Correu electrònic:</strong> {userInfo.email}
          </p>

          {/* Campo de Centre de cost (CAI Petició) con datalist */}
          <div className="space-y-2 mt-2">
            <label htmlFor="costCenter" className="text-sm font-medium">
              Centre de cost (CAI Petició) *
            </label>
            <Input
              id="costCenter"
              type="text"
              list="costCenterList"
              value={userInfo.costCenter || ""}
              onChange={(e) => handleCostCenterChange(e.target.value)}
              placeholder="Introdueix o selecciona el centre de cost"
              required
            />
            <datalist id="costCenterList">
              {costCenters.map((cc) => (
                <option key={cc.value} value={cc.value}>
                  {cc.label}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="deliveryLocation" className="text-sm font-medium">
              Lloc de lliurament *
            </label>
            <Input
              id="deliveryLocation"
              value={deliveryLocation}
              onChange={(e) => onDeliveryLocationChange(e.target.value)}
              placeholder="Indica on vols rebre el material"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium">
              Comentaris
            </label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              placeholder="Afegeix comentaris addicionals si ho necessites"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Articles sol·licitats</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.product.codsap}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium truncate">{item.product.descripcion}</p>
                  <p className="text-xs text-gray-500">
                    SAP: {item.product.codsap} | AS400: {item.product.codas400}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        onUpdateQuantity?.(item.product.codsap, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        onUpdateQuantity?.(item.product.codsap, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 h-6 text-xs px-2"
                    onClick={() => onRemove(item.product.codsap)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 bg-white">
        <Button onClick={onSubmit} className="w-full" disabled={!deliveryLocation.trim()}>
          Confirmar sol·licitud
        </Button>
      </div>
    </div>
  );
};