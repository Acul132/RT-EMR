const request = require('request')
const _colors = require('colors')
const progress = require('request-progress')
const cliProgress = require('cli-progress')
const r = require('rethinkdbdash')({
    db: "emrsystem"
})


let drugProducts,activeIngredients;
let drugsFinal = []

const  progressbar = new cliProgress.SingleBar({
    format: 'Progress |' + _colors.cyan('{bar}') + '| {percentage}% || Speed: {speed} MB/sec',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

console.log("Downloading medication data...")
progressbar.start(100,0,{speed:'N/A'})

progress(request({uri: 'https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json', json: true}, (error,response,body) => {
    progressbar.update(25, {speed: 0})
    drugProducts = body.filter(drug => drug.class_name == 'Human')

    progress(request({uri: 'https://health-products.canada.ca/api/drug/activeingredient/?lang=en&type=json', json: true}, (error,response,body) => {
        progressbar.update(50, {speed: 0})

        activeIngredients = body

        for(let i=0; i<drugProducts.length; i++) {
            progressbar.update(((i/drugProducts.length)*50)+50,{speed:'N/A'});
            const joinedObject = (activeIngredients.find((itmInner) => itmInner.drug_code === drugProducts[i].drug_code))
            drugsFinal.push({
                din: drugProducts[i].drug_identification_number,
                manufacturer: drugProducts[i].company_name, 
                name: joinedObject.ingredient_name,
                strength: joinedObject.strength,
                unit_of_measure: joinedObject.strength_unit
            });
        }

        progressbar.update(100)
        progressbar.stop();

        console.log("Medications downloaded and joined!\nImporting into database...")
        r.table('medications').insert(drugsFinal).run()
        .then(results => console.log("Medications imported into database!"))
        .catch(err => console.log(err))
    }))
    .on('progress', state => {
        progressbar.update(state.percent*25+25, {speed:(state.speed/Math.pow(10,6)).toFixed(2)})
    })
}))
.on('progress', state => {
    progressbar.update(state.percent*25, {speed:(state.speed/Math.pow(10,6)).toFixed(2)})
})


  