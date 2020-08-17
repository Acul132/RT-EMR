const request = require('request')
const _colors = require('colors')
const progress = require('request-progress')
const cliProgress = require('cli-progress')
const r = require('rethinkdbdash')({
    db: "emrsystem"
})

const positions = [
    'da4c399f-0fe5-463b-b1c6-894d947ce91b',
    '617831d4-15d3-4923-9711-f75c22c9d3a3',
    '1d9bb230-cee2-43a5-9102-daa317858be4',
]
    



const  progressbar = new cliProgress.SingleBar({
    format: 'Progress |' + _colors.cyan('{bar}') + '| {percentage}% || Speed: {speed} MB/sec',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

console.log("Downloading staff data...")
progressbar.start(100,0,{speed:'N/A'})


progress(request({uri: 'https://randomuser.me/api?results=1000&nat=ca', json: true}, (error,response,body) => {
    progressbar.update(25, {speed: 0})
    for(let i = 0; i < body.results.length; i++) {
        let user = body.results[i];
        let location = {
            address: user.location.street.number + " " + user.location.street.name,
            city: user.location.city,
            province: user.location.state,
            country: user.location.country,
            postal_code: user.location.postcode,
            location_style: "house"
        }
        let person = {
            active: true,
            dob: user.dob.date,
            first_name: user.name.first,
            last_name: user.name.last,
            phone_number: user.phone,
            sex: user.gender,
            picture: user.picture.large
        }
        let staff = {
            licence_number: Math.floor(Math.random() * 99999) + 10000,
            position_id: positions[Math.floor(Math.random() * 3)]
        }
        

        r.table('locations').insert(location).run().then(({generated_keys}) => {
            person.location_id = generated_keys[0];
            r.table('persons').insert(person).run().then(({generated_keys}) => {
                staff.person_id = generated_keys[0];
                r.table('staff').insert(staff).run().then(() => {
                    progressbar.update(((i + 1 / body.results.length) * 75) + 25)
                    setTimeout(() => {
                        if(i + 1 == body.results.length) {
                            process.exit(0)
                        }
                    }, 300)
                })
            })
        })
    }
    
    
}))
.on('progress', state => {
    progressbar.update(state.percent*25, {speed:(state.speed/Math.pow(10,6)).toFixed(2)})
})