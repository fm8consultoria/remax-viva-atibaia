const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Lista de URLs dos imóveis (lista completa)
const imoveisUrls = [
  // Terrenos
  { id: '690471003-26', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/bueno-brandao/s-n-sitio-santo-antonio-proximo-a-cidade-de-bueno-brandao/690471003-26', tipo: 'Terreno' },
  { id: '690471003-97', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/bom-jesus-dos-perdoes/306-rua-leonildo-ramos-pinto-marf-ii/690471003-97', tipo: 'Terreno' },
  { id: '690471003-103', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rua-turmalina/690471003-103', tipo: 'Terreno' },
  { id: '690471003-112', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/2795-estr-mun-luciano-rocha-pecanha/690471003-112', tipo: 'Terreno' },
  { id: '690471013-5', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-14-rua-avare-avenida-paulista/690471013-5', tipo: 'Terreno' },
  { id: '690471013-6', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-17-rua-avare-avenida-paulista/690471013-6', tipo: 'Terreno' },
  { id: '690471013-7', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-01-rua-jundiai-avenida-paulista/690471013-7', tipo: 'Terreno' },
  { id: '690471013-8', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-04-rua-violeta-al-lucas-nogueira-garcez/690471013-8', tipo: 'Terreno' },
  { id: '690471013-11', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-16-rua-avare-av-paulista/690471013-11', tipo: 'Terreno' },
  { id: '690471013-13', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-13-rua-avare-avenida-paulista/690471013-13', tipo: 'Terreno' },
  { id: '690471013-15', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-02-rua-jundiai-avenida-paulista/690471013-15', tipo: 'Terreno' },
  { id: '690471013-16', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-18-rua-avare/690471013-16', tipo: 'Terreno' },
  { id: '690471013-17', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-15-rua-avare-avenida-paulista/690471013-17', tipo: 'Terreno' },
  { id: '690471015-990', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/bom-jesus-dos-perdoes/168-rua-milao/690471015-990', tipo: 'Terreno' },
  { id: '690471017-59', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rua-serra-do-itapetinga-proximo-a-al-lucas-n-garcez/690471017-59', tipo: 'Terreno' },
  { id: '690471017-70', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rua-serra-do-itapetinga-proximo-a-al-lucas-n-garcez/690471017-70', tipo: 'Terreno' },
  { id: '690471017-76', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rodovia-municipal-engenharia-mackenzie-sublote-d-proximo-ao-frango-assado/690471017-76', tipo: 'Terreno' },
  { id: '690471017-77', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-7-rua-professor-ismenia-cunha-cintra-proximo-a-al-lucas-n-garcez/690471017-77', tipo: 'Terreno' },
  { id: '690471017-86', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/00-rua-torenia-proximo-ao-frango-assado/690471017-86', tipo: 'Terreno' },
  { id: '690471017-88', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/s-n-estrada-hisaichi-takebayashi-em-frente-ao-orquidario-takebayashi/690471017-88', tipo: 'Terreno' },
  { id: '690471058-27', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-alameda-das-araras/690471058-27', tipo: 'Terreno' },
  { id: '690471058-28', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-avenida-dos-jacarandas/690471058-28', tipo: 'Terreno' },
  { id: '690471058-42', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/s-n-rua-francisco-mendes/690471058-42', tipo: 'Terreno' },
  { id: '690471058-44', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-avenida-dos-jacarandas/690471058-44', tipo: 'Terreno' },
  { id: '690471058-45', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/bom-jesus-dos-perdoes/s-n-estrada-velha-perdoes-piracaia-condominio-alto-da-floresta/690471058-45', tipo: 'Terreno' },
  { id: '690471080-8', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/645-rua-dos-lirios-prox-a-rua-violeta/690471080-8', tipo: 'Terreno' },
  { id: '690471080-11', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/300-estrada-caminho-da-mata/690471080-11', tipo: 'Terreno' },
  { id: '690471099-9', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/s-n-alameda-joviano-alvim-chacara-tabatinguera/690471099-9', tipo: 'Terreno' },
  { id: '690471099-11', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/centro-de-convencao/690471099-11', tipo: 'Terreno' },
  { id: '690471099-12', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/centro-de-convencoes/690471099-12', tipo: 'Terreno' },
  { id: '690471124-58', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/indaiatuba/s-n-rua-antonio-costola-terras-de-itaici/690471124-58', tipo: 'Terreno' },
  { id: '690471124-60', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/indaiatuba/02-rua-manchester-proximo-ao-clube-9-de-julho/690471124-60', tipo: 'Terreno' },
  { id: '690471126-167', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/indaiatuba/221-rua-betty-hass-de-campos/690471126-167', tipo: 'Terreno' },
  { id: '690471146-7', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/370-alameda-desembargador-teodomiro-de-toledo-piza-proximo-a-escola-major-juvenal-alvim/690471146-7', tipo: 'Terreno' },
  { id: '690471146-8', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/340-alameda-desembargador-teodomiro-de-toledo-piza-proximo-a-escola-major-juvenal-alvim/690471146-8', tipo: 'Terreno' },

  // Apartamentos
  { id: '690471003-100', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/339-avenida-ipe-mc-donald/690471003-100', tipo: 'Apartamento' },
  { id: '690471003-109', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/198-avenida-atibaia/690471003-109', tipo: 'Apartamento' },
  { id: '690471003-117', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/149-rua-carmela-memolo/690471003-117', tipo: 'Apartamento' },
  { id: '690471003-123', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/6997-avenida-jeronimo-de-camargo/690471003-123', tipo: 'Apartamento' },
  { id: '690471017-81', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/100-av-dos-jacarandas-proximo-ao-lago-do-jardim-dos-pinheiros/690471017-81', tipo: 'Apartamento' },
  { id: '690471020-45', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/376-avenida-santana/690471020-45', tipo: 'Apartamento' },
  { id: '690471058-40', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/125-avenida-sao-paulo/690471058-40', tipo: 'Apartamento' },
  { id: '690471095-11', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/proximo-a-rua-clovis-soares/690471095-11', tipo: 'Apartamento' },
  { id: '690471124-54', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/indaiatuba/80-rua-das-margaridas-proximo-ao-parque-ecologico/690471124-54', tipo: 'Apartamento' },
  { id: '690471124-61', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/indaiatuba/194-rua-pedro-americo-proximo-ao-frutal/690471124-61', tipo: 'Apartamento' },
  { id: '690471126-188', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/salto/79-rua-sao-mateus-torre-saut/690471126-188', tipo: 'Apartamento' },
  { id: '690471126-219', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/indaiatuba/690471126-219', tipo: 'Apartamento' },
  { id: '690471127-16', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/salto/90-rua-eviner-gonzaga-proximo-ao-clube-de-campo-saltense/690471127-16', tipo: 'Apartamento' },
  { id: '690471127-47', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/salto/90-rua-eviner-gonzaga-proximo-ao-clube-de-campo-saltense/690471127-47', tipo: 'Apartamento' },
  { id: '690471127-48', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/salto/347-rua-henrique-viscardi-proximo-ao-academia-corpo-sao/690471127-48', tipo: 'Apartamento' },
  { id: '690471154-2', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/3479-avenida-santana-750m-apos-a-pista-de-pouso-paraglider-asa-delta/690471154-2', tipo: 'Apartamento' },

  // Casas
  { id: '690471003-84', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/13-rua-magnolia/690471003-84', tipo: 'Casa' },
  { id: '690471003-93', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/mairipora/89-avenida-flamboyant/690471003-93', tipo: 'Casa' },
  { id: '690471003-95', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/bom-jesus-dos-perdoes/390-rua-santa-rita/690471003-95', tipo: 'Casa' },
  { id: '690471003-102', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/703-rua-joao-soares-do-amaral/690471003-102', tipo: 'Casa' },
  { id: '690471003-105', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/57-rua-dos-alecrins-big-supermercado/690471003-105', tipo: 'Casa' },
  { id: '690471003-113', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/510-rua-10/690471003-113', tipo: 'Casa' },
  { id: '690471003-118', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/20-rua-sao-bernardo-jardim-paulista/690471003-118', tipo: 'Casa' },
  { id: '690471003-120', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/1060-rua-araraquara-jardim-paulista/690471003-120', tipo: 'Casa' },
  { id: '690471013-29', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/36-rua-deputado-emilio-justo-proximo-a-al-lucas-n-garcez/690471013-29', tipo: 'Casa' },
  { id: '690471015-987', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/260-avenida-atibaia-travessa-da-santana/690471015-987', tipo: 'Casa' },
  { id: '690471017-67', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/332-rua-brincos-de-princesa-proximo-ao-supermercado-uniao/690471017-67', tipo: 'Casa' },
  { id: '690471017-84', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/30-rua-brincos-de-ouro-proximo-ao-supermercado-big/690471017-84', tipo: 'Casa' },
  { id: '690471017-90', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/80-rua-das-avencas-retiro-das-fontes/690471017-90', tipo: 'Casa' },
  { id: '690471020-49', url: 'https://www.remax.com.br/pt-br/imoveis/sobrado/venda/atibaia/81-rua-jacaranda-lago-major/690471020-49', tipo: 'Casa' },
  { id: '690471020-53', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/85-rua-paulo-de-tarso-dos-santos-silva-ao-lado-do-colegio-coc-atibaia/690471020-53', tipo: 'Casa' },
  { id: '690471020-59', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/584-avenida-orquidea/690471020-59', tipo: 'Casa' },
  { id: '690471058-39', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/670-rua-joao-pires/690471058-39', tipo: 'Casa' },
  { id: '690471058-43', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/134-rua-dos-coqueiros/690471058-43', tipo: 'Casa' },
  { id: '690471058-46', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/134-rua-dos-coqueiros/690471058-46', tipo: 'Casa' },
  { id: '690471095-8', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/14-rua-sesquicentenario/690471095-8', tipo: 'Casa' },
  { id: '690471095-14', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/39-r-jose-siqueira-bastos-etec-atibaia/690471095-14', tipo: 'Casa' },
  { id: '690471102-10', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/364-rua-dona-sylvia-finco-da-costa-proximo-ao-parque-edmundo-zanoni/690471102-10', tipo: 'Casa' },
  { id: '690471102-18', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/312-rua-pompeu-vairo-proximo-a-av-lucas-nogueira-garcez/690471102-18', tipo: 'Casa' },
  { id: '690471111-83', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/bom-jesus-dos-perdoes/177-rua-nair-passos-servilha/690471111-83', tipo: 'Casa' },
  { id: '690471120-58', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/indaiatuba/366-rua-robison-gebara-altero-parque-ecologico/690471120-58', tipo: 'Casa' },
  { id: '690471120-63', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/indaiatuba/54-rua-sebastiao-dos-santos-itaici/690471120-63', tipo: 'Casa' },
  { id: '690471124-52', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/indaiatuba/93-rua-guaicurus-em-frente-ao-park-meraki/690471124-52', tipo: 'Casa' },
  { id: '690471124-55', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/indaiatuba/1128-rua-joao-walsh-costa-proximo-ao-parque-ecologico/690471124-55', tipo: 'Casa' },

  // Casas de Condomínio
  { id: '690471003-94', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/bom-jesus-dos-perdoes/80-rua-acacio-felix-da-costa/690471003-94', tipo: 'Casa de Condomínio' },
  { id: '690471003-104', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/115-rua-lantana/690471003-104', tipo: 'Casa de Condomínio' },
  { id: '690471003-107', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-vila/venda/atibaia/65-rua-cravinias/690471003-107', tipo: 'Casa de Condomínio' },
  { id: '690471017-78', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/170-av-delfina-silveira-pecanha-travessa-da-av-juca-pecanha/690471017-78', tipo: 'Casa de Condomínio' },
  { id: '690471020-51', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/370-estrada-soberana-proximo-ao-centro-da-cidade/690471020-51', tipo: 'Casa de Condomínio' },
  { id: '690471058-37', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/1700-estrada-do-mingu/690471058-37', tipo: 'Casa de Condomínio' },
  { id: '690471058-47', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/bom-jesus-dos-perdoes/534-rua-jatoba/690471058-47', tipo: 'Casa de Condomínio' },
  { id: '690471102-8', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/250-avenida-walter-engracia-de-oliveira-proximo-ao-supermercado-convem/690471102-8', tipo: 'Casa de Condomínio' },
  { id: '690471111-89', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/125-alameda-africa-condominio-terras-de-atibaia-ii/690471111-89', tipo: 'Casa de Condomínio' },
  { id: '690471117-2', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/167-rua-bandeirante-francisco-dias-velho/690471117-2', tipo: 'Casa de Condomínio' },
  { id: '690471119-47', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/indaiatuba/93-rua-senhor-teobaldo-costa-azevedo-condominio-residencial-milano/690471119-47', tipo: 'Casa de Condomínio' },
  { id: '690471119-50', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/indaiatuba/145-rua-serra-do-roncador-condominio-residencial-terra-magna/690471119-50', tipo: 'Casa de Condomínio' },
  { id: '690471119-52', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/indaiatuba/690471119-52', tipo: 'Casa de Condomínio' },
  { id: '690471123-75', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/44-rua-bandeirante-francisco-bueno/690471123-75', tipo: 'Casa de Condomínio' },
  { id: '690471123-98', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/625-rua-maestro-agostinho-pereira-de-oliveira-proximo-a-escolas-academias-e-mercados/690471123-98', tipo: 'Casa de Condomínio' },
  { id: '690471123-99', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/223-rua-roberto-brichesi-proximo-a-escolas-academias-e-mercados/690471123-99', tipo: 'Casa de Condomínio' },
  { id: '690471123-100', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/602-rua-joaquim-de-arruda-sontag-proximo-a-escolas-academias-e-mercados/690471123-100', tipo: 'Casa de Condomínio' },
  { id: '690471128-13', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/ao-lago-do-colegio-anglo/690471128-13', tipo: 'Casa de Condomínio' },
  { id: '690471128-12', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/ao-lago-do-colegio-anglo/690471128-12', tipo: 'Casa de Condomínio' },
  { id: '690471128-14', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/372-rua-maestro-amancio-maestrello-proximo-ao-mc-donalds/690471128-14', tipo: 'Casa de Condomínio' },
  { id: '690471128-15', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/salto/ao-lago-do-colegio-anglo/690471128-15', tipo: 'Casa de Condomínio' },
  { id: '690471148-1', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/indaiatuba/146-rua-renato-eusebio-dos-santos-condominio-residencial-milano/690471148-1', tipo: 'Casa de Condomínio' },
  { id: '690471148-2', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/indaiatuba/690471148-2', tipo: 'Casa de Condomínio' },
  { id: '690471148-7', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/indaiatuba/690471148-7', tipo: 'Casa de Condomínio' },

  // Chácaras/Sítios
  { id: '690471003-96', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/nazare-paulista/269-rua-jose-da-silva/690471003-96', tipo: 'Chácara/Sítio' },
  { id: '690471003-99', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/atibaia/368-rua-das-margaridas-motel-tenesse/690471003-99', tipo: 'Chácara/Sítio' },
  { id: '690471080-10', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/atibaia/50-estrada-caminho-das-matas-jd-maracana/690471080-10', tipo: 'Chácara/Sítio' },
  { id: '690471119-51', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/indaiatuba/condominio-vale-das-laranjeiras/690471119-51', tipo: 'Chácara/Sítio' },
  { id: '690471124-59', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/indaiatuba/570-rua-dos-curiangos-em-frente-ao-condominio-toscana/690471124-59', tipo: 'Chácara/Sítio' },
  { id: '690471126-61', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/indaiatuba/2223-rua-zenite-furakawa/690471126-61', tipo: 'Chácara/Sítio' },
  { id: '690471126-155', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/indaiatuba/690471126-155', tipo: 'Chácara/Sítio' },

  // Comercial
  { id: '690471015-501', url: 'https://www.remax.com.br/pt-br/imoveis/restaurante/venda/atibaia/1-alameda-lucas-nogueira-garcez-vila-thais-atiba/690471015-501', tipo: 'Comercial' },
  { id: '690471102-26', url: 'https://www.remax.com.br/pt-br/imoveis/ponto-comercial/-loja/venda/atibaia/444-avenida-sao-joao/690471102-26', tipo: 'Comercial' },
  { id: '690471124-53', url: 'https://www.remax.com.br/pt-br/imoveis/casa-comercial/venda/indaiatuba/93-rua-guaicurus-em-frente-ao-park-meraki/690471124-53', tipo: 'Comercial' },
  { id: '690471124-56', url: 'https://www.remax.com.br/pt-br/imoveis/casa-comercial/venda/indaiatuba/320-rua-jose-escodro-proximo-ao-estadio-do-primavera/690471124-56', tipo: 'Comercial' },
  { id: '690471124-62', url: 'https://www.remax.com.br/pt-br/imoveis/casa-comercial/venda/indaiatuba/216-rua-uruguai-proximo-a-av-conceicao/690471124-62', tipo: 'Comercial' },

  // Fazenda
  { id: '690471017-68', url: 'https://www.remax.com.br/pt-br/imoveis/fazenda/venda/atibaia/00-estrada-municipal-epsuo-akai-bairro-do-tanque/690471017-68', tipo: 'Fazenda' }
];

// Função para extrair dados de um imóvel usando navegação DOM
async function extractImovelData(page, imovelInfo) {
  try {
    console.log(`Extraindo dados do imóvel: ${imovelInfo.id}`);
    
    await page.goto(imovelInfo.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Aguardar o carregamento da página
    await page.waitForTimeout(2000);

    // Extrair dados usando navegação DOM
    const imovelData = await page.evaluate(() => {
      const data = {
        id: '',
        titulo: '',
        preco: '',
        precoDolar: '',
        endereco: '',
        cidade: '',
        estado: '',
        tipo: '',
        area: '',
        quartos: '',
        banheiros: '',
        vagas: '',
        descricao: '',
        imagens: [],
        caracteristicas: [],
        corretor: '',
        telefone: '',
        email: '',
        url: window.location.href
      };

      // Extrair título
      const tituloElement = document.querySelector('h1');
      if (tituloElement) {
        data.titulo = tituloElement.textContent.trim();
      }

      // Extrair preço
      const precoMatch = document.body.textContent.match(/R\$\s*([\d.,]+)/i);
      if (precoMatch) {
        data.preco = 'R$ ' + precoMatch[1];
      }

      // NOVA ABORDAGEM: Procurar pela div listing-attributes-icons e percorrer seus elementos
      const attributesDiv = document.querySelector('div[id="listing-attributes-icons"]');
      
      if (attributesDiv) {
        // Procurar por todos os elementos <p> dentro da div
        const pElements = attributesDiv.querySelectorAll('p[class*="css-1l0ew3p"]');
        
        const attributes = [];
        pElements.forEach(p => {
          attributes.push(p.textContent.trim());
        });
        
        // Processar os atributos em pares (label, valor)
        for (let i = 0; i < attributes.length; i += 2) {
          if (i + 1 < attributes.length) {
            const label = attributes[i];
            const value = attributes[i + 1];
            
            // Mapear labels para campos
            if (label.includes('Ambientes Totais')) {
              data.quartos = value + ' ambientes';
            } else if (label.includes('Banheiros')) {
              data.banheiros = value + ' banheiros';
            } else if (label.includes('Tamanho do Lote')) {
              data.area = value + ' m²';
            } else if (label.includes('Dormitórios') || label.includes('DormitÃ³rios')) {
              data.quartos = value + ' dormitórios';
            } else if (label.includes('Área M²') || label.includes('Ãrea MÂ²')) {
              if (!data.area) data.area = value + ' m²';
            } else if (label.includes('Área Útil') || label.includes('Ãrea Ãštil')) {
              if (!data.area) data.area = value + ' m²';
            } else if (label.includes('Vagas de Estacionamento')) {
              data.vagas = value + ' vagas';
            }
          }
        }
      } else {
        // Fallback: procurar por padrões específicos no HTML completo
        const text = document.body.textContent;
        
        // Ambientes Totais
        const ambientesMatch = text.match(/Ambientes Totais[^>]*>.*?(\d+)/);
        if (ambientesMatch) {
          data.quartos = ambientesMatch[1] + ' ambientes';
        }
        
        // Banheiros
        const banheirosMatch = text.match(/Banheiros[^>]*>.*?(\d+)/);
        if (banheirosMatch) {
          data.banheiros = banheirosMatch[1] + ' banheiros';
        }
        
        // Tamanho do Lote
        const loteMatch = text.match(/Tamanho do Lote[^>]*>.*?(\d{1,3}(?:\.\d{3})*)/);
        if (loteMatch) {
          data.area = loteMatch[1] + ' m²';
        }
        
        // Dormitórios
        const dormitoriosMatch = text.match(/Dormit[Ã³o]rios[^>]*>.*?(\d+)/);
        if (dormitoriosMatch) {
          data.quartos = dormitoriosMatch[1] + ' dormitórios';
        }
        
        // Área M²
        const areaMatch = text.match(/[ÁÃ]rea M[Â²]?[^>]*>.*?(\d{1,3}(?:\.\d{3})*)/);
        if (areaMatch && !data.area) {
          data.area = areaMatch[1] + ' m²';
        }
        
        // Área Útil
        const areaUtilMatch = text.match(/[ÁÃ]rea [ÚU]til[^>]*>.*?(\d{1,3}(?:\.\d{3})*)/);
        if (areaUtilMatch && !data.area) {
          data.area = areaUtilMatch[1] + ' m²';
        }
        
        // Vagas de Estacionamento
        const vagasMatch = text.match(/Vagas de Estacionamento[^>]*>.*?(\d+)/);
        if (vagasMatch) {
          data.vagas = vagasMatch[1] + ' vagas';
        }
      }

      // Extrair imagens
      const allImages = Array.from(document.querySelectorAll('img'));
      data.imagens = allImages
        .map(img => img.src)
        .filter(src => src && !src.includes('data:') && !src.includes('icon-') && !src.includes('logo'))
        .filter(src => src.includes('remax.azureedge.net') || src.includes('userimages'));

      // Extrair corretor
      const corretorMatch = document.body.textContent.match(/(Lucia|Helena|Mazolini|Soto|RE\/MAX VIVA)/i);
      data.corretor = corretorMatch ? corretorMatch[0] : '';

      // Extrair telefone
      const telefoneMatch = document.body.textContent.match(/(\+55\s*11\s*9\d{8}|\(11\)\s*9\d{4}-\d{4}|\(11\)\s*9\d{8})/i);
      data.telefone = telefoneMatch ? telefoneMatch[0] : '';

      return data;
    });

    // Adicionar informações básicas
    imovelData.id = imovelInfo.id;
    imovelData.tipo = imovelInfo.tipo;
    imovelData.url = imovelInfo.url;

    // Extrair cidade da URL
    const urlParts = imovelInfo.url.split('/');
    const cidadeIndex = urlParts.findIndex(part => part === 'venda') + 1;
    if (cidadeIndex < urlParts.length) {
      imovelData.cidade = urlParts[cidadeIndex].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    console.log(`✅ Dados extraídos: ${imovelData.titulo || 'Sem título'} - ${imovelData.cidade || 'Sem cidade'}`);
    console.log(`   Área: ${imovelData.area || 'N/A'} | Quartos: ${imovelData.quartos || 'N/A'} | Banheiros: ${imovelData.banheiros || 'N/A'} | Vagas: ${imovelData.vagas || 'N/A'}`);
    return imovelData;

  } catch (error) {
    console.error(`❌ Erro ao extrair dados do imóvel ${imovelInfo.id}:`, error.message);
    return {
      id: imovelInfo.id,
      tipo: imovelInfo.tipo,
      url: imovelInfo.url,
      erro: error.message,
      titulo: 'Erro ao carregar',
      preco: 'N/A'
    };
  }
}

// Função principal
async function scrapeImoveis() {
  console.log('🚀 Iniciando scraping dos imóveis...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  // Configurar viewport
  await page.setViewport({ width: 1920, height: 1080 });

  const imoveisData = [];
  const totalImoveis = imoveisUrls.length;

  for (let i = 0; i < imoveisUrls.length; i++) {
    const imovelInfo = imoveisUrls[i];
    console.log(`\n📊 Progresso: ${i + 1}/${totalImoveis} - ${imovelInfo.id}`);
    
    try {
      const imovelData = await extractImovelData(page, imovelInfo);
      imoveisData.push(imovelData);
      
      // Aguardar entre requisições para não sobrecarregar o servidor
      await page.waitForTimeout(1000);
      
    } catch (error) {
      console.error(`❌ Erro geral no imóvel ${imovelInfo.id}:`, error.message);
      imoveisData.push({
        id: imovelInfo.id,
        tipo: imovelInfo.tipo,
        url: imovelInfo.url,
        erro: error.message,
        titulo: 'Erro ao carregar',
        preco: 'N/A'
      });
    }
  }

  await browser.close();

  // Salvar dados em JSON
  const outputDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'imoveis-data.json');
  fs.writeFileSync(outputFile, JSON.stringify(imoveisData, null, 2), 'utf8');

  // Salvar também um resumo
  const resumo = {
    totalImoveis: imoveisData.length,
    imoveisComErro: imoveisData.filter(imovel => imovel.erro).length,
    imoveisComSucesso: imoveisData.filter(imovel => !imovel.erro).length,
    dataExtracao: new Date().toISOString(),
    tipos: [...new Set(imoveisData.map(imovel => imovel.tipo))],
    cidades: [...new Set(imoveisData.map(imovel => imovel.cidade).filter(cidade => cidade))]
  };

  const resumoFile = path.join(outputDir, 'resumo-extracao.json');
  fs.writeFileSync(resumoFile, JSON.stringify(resumo, null, 2), 'utf8');

  console.log('\n🎉 Scraping concluído!');
  console.log(`📁 Dados salvos em: ${outputFile}`);
  console.log(`📊 Resumo salvo em: ${resumoFile}`);
  console.log(`✅ Imóveis processados: ${resumo.imoveisComSucesso}/${resumo.totalImoveis}`);
  console.log(`❌ Imóveis com erro: ${resumo.imoveisComErro}`);

  return imoveisData;
}

// Executar se chamado diretamente
if (require.main === module) {
  scrapeImoveis().catch(console.error);
}

module.exports = { scrapeImoveis, imoveisUrls };
