const r = require('rethinkdbdash')({
    db: "emrsystem"
})

const wardName = [
    'Admissions',
    'Accident and emergency',
    'Anesthetics',
    'Breast Screening',
    'Burn Center',
    'Cardiology',
    'Central Sterile Services',
    'Chaplaincy',
    'Coronary Care Unit',
    'Critical Care',
    'Diagnostic Imaging',
    'Discharge Lounge',
    'Elderly services',
    'Finance Department',
    'Gastroenterology',
    'General Services',
    'General Surgery',
    'Gynecology',
    'Haematology',
    'Health & Safety',
    'Intensive Care Unit',
    'Human Resources',
    'Infection Control',
    'Information Management',
    'Maternity',
    'Medical Records',
    'Microbiology',
    'Neonatal',
    'Nephrology',
    'Neurology',
    'Nutrition and Dietetics',
    'Gynecology',
    'Occupational Therapy',
    'Oncology',
    'Ophthalmology',
    'Orthopaedics',
    'Otolaryngology',
    'Pain Management',
    'Patient Accounts',
    'Patient Services',
    'Physiotherapy',
    'Radiology',
    'Radiotherapy',
    'Renal',
    'Rheumatology',
    'Sexual Health',
    'Social Work',
    'Urology'
]
let wards = []
for(let i = 0; i < wardName.length; i++) {
    let floor  = Math.floor(Math.random() * 5) + 1
    let rooms = [];
    let roomCount = Math.floor(Math.random() * 20) + 10;
    let roomStart = Math.floor(Math.random() * (100 - roomCount)) + 1;
    for(let j = 0; j < roomCount; j++) {
        wards.push({
            room: floor * 100 + roomStart + j,
            floor: floor,
            department_name: wardName[i]
        })
    }
}

r.table('wards').insert(wards).run().then(() => console.log("Done!"))