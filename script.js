



(async() => {
let $usd = document.getElementById('dolar');
let $brl = document.getElementById('real');
let $ptax = document.getElementById('ptax');
let $iof = document.getElementById('iof');
let $spread = document.getElementById('spread');
let dolar = 0;
let defaultIof = 6.38;
let defaultSpread = 4;

let resp = await fetch('https://www.bcb.gov.br/api/conteudo/pt-br/PAINEL_INDICADORES/cambio?')
let dados = await resp.json();
dolar = dados.conteudo[0].valorVenda;

function numToStr(num) {
    return ('' + num).replace('.', ',');
}

function strToNum(str) {
    return +str.replace(',', '.');
}

function getIof() {
    return strToNum($iof.value) / 100;
}

function getSpread() {
    return strToNum($spread.value) / 100;
}

function getDollar() {
    return strToNum($ptax.value) * (1 + getSpread());
}

function round(value) {
    // Arredondar valor final (https://stackoverflow.com/a/18358056)
    value = +(Math.round(value + "e+2")  + "e-2");

    // Garantir que vai usar duas casas decimais
    value = value.toFixed(2);

    return value;
}

function onInput(obj, callback) {
    obj.addEventListener('input', function() {
        callback();
    });
}

function usdToBrl() {
    // Valor da compra em dólar
    var usd = strToNum($usd.value);

    // Multiplica pelo valor do dólar ptax com spread
    var value = usd * getDollar();

    // Adiciona o IOF
    value += getIof() * value;

    // Arredondar valor
    value = round(value);

    if (isNaN(value)) {
        return;
    }

    $brl.value = numToStr(value);

    // if ($stepToStep.childElementCount) {
    //     stepToStepUsdToBrl();
    // }

    location.replace('#dolar=' + $usd.value);
}

function brlToUsd() {
    // Valor da compra em reais
    var brl = strToNum($brl.value);

    // Descobre o valor em dólar sem o IOF
    // USD + USD*IOF = BRL
    // USD*(1 + IOF) = BRL
    // USD = BRL/(1 + IOF)
    var value = brl / (1 + getIof());

    // Divide pelo valor de 1 dólar com spread
    value /= getDollar();

    // Arredondar valor
    value = round(value);

    if (isNaN(value)) {
        return;
    }

    $usd.value = numToStr(value);

    // if ($stepToStep.childElementCount) {
    //     stepToStepUsdToBrl();
    // }

    location.replace('#real=' + $brl.value);
}

onInput($usd, usdToBrl);
onInput($brl, brlToUsd);
onInput($iof, usdToBrl);
onInput($spread, usdToBrl);
onInput($ptax, usdToBrl);

$ptax.value = numToStr(dolar);
$iof.value = numToStr(defaultIof);
$spread.value = numToStr(defaultSpread);

window.onload = () =>{
    $usd.value = '1';
    usdToBrl();
    };
})()

