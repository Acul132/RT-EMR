const request = require('request-promise')
const cliProgress = require('cli-progress')

let drugProducts,activeIngredients;
let drugsFinal = []
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar1.start(200,0);

request({uri: 'https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json', json: true})
.then(drugs => {
    bar1.update(50)
    drugProducts = drugs.filter(drug => drug.class_name == 'Human')

    request({uri: 'https://health-products.canada.ca/api/drug/activeingredient/?lang=en&type=json', json: true})
    .then(drugs => {
        bar1.update(100)
        activeIngredients = drugs

        for(let i=0; i<drugProducts.length; i++) {
            bar1.update(((i/drugProducts.length)*100) + 100);
            drugsFinal.push({
             ...drugProducts[i], 
             ...(activeIngredients.find((itmInner) => itmInner.drug_code === drugProducts[i].drug_code))}
            );
        }

        console.log(drugsFinal[0])
        console.log(drugsFinal[1])
        bar1.stop();
    })
    .catch(err => console.log(err))
})
.catch(err => console.log(err))


  