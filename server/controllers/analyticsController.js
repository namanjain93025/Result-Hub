import StudentResult from '../models/studentResult.js'


export const getTopPerformers = async(req , res)=>{
 try {
  // console.log('i am inside getTopPerformer')
    //step1 : fetch by => section,branch,semester,
    const { branch, section, batch, semester } = req.query;
    
    if(!branch || !section || !batch || !semester){
        return res.json({
            success : true,
            message : 'enter all fields',
        })
    }
    //fetch data from db and sort them in decreasing order of sgpa
    const topperList = await StudentResult.find({branch,section,batch,semester})
                                          .sort({sgpa : -1})
                                          .limit(20);
    if(!topperList){
        return res.josn({
            success : false,
            message : 'data not found'
        })
    }   
    return res.json({
        success : true,
        topperList,
    })                                   
    
 } catch (error) {
    return res.json({
        success: false,
        message : error.message,
    })
 }
}

export const getBranchReport = async (req, res) => {
  try {
const { branch, section, batch, semester } = req.query;

    if (!branch || !section || !batch || !semester) {
      return res.status(400).json({
        success: false,
        message: "Enter all fields",
      });
    }

    const studentList = await StudentResult.find({
      branch,
      section,
      batch,
      semester,
    });

    if (studentList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    if (!studentList[0].subjects || studentList[0].subjects.length < 6) {
      return res.status(400).json({
        success: false,
        message: "At least six subjects are required",
      });
    }

    const totalStudent = studentList.length;
    let totalSgpa = 0;

    const sub1name = studentList[0].subjects[0].subjectName;
    const sub2name = studentList[0].subjects[1].subjectName;
    const sub3name = studentList[0].subjects[2].subjectName;
    const sub4name = studentList[0].subjects[3].subjectName;
    const sub5name = studentList[0].subjects[4].subjectName;
    const sub6name = studentList[0].subjects[5].subjectName;

    let sub1grade = 0;
    let sub2grade = 0;
    let sub3grade = 0;
    let sub4grade = 0;
    let sub5grade = 0;
    let sub6grade = 0;
    
    const gradeMap = {
      "O" : 10,
      "A+": 9,
      "A" : 8,
      "B+": 7,
      "B" : 6,
      "C" : 5,
      "p" : 4,
      "F" : 3,
    }
    for (let i = 0; i < totalStudent; i++) {
      if (!studentList[i].subjects || studentList[i].subjects.length < 6) {
        continue;
      }

      totalSgpa += Number(studentList[i].sgpa) || 0;
        
      sub1grade += Number(gradeMap[studentList[i].subjects[0].theoryGrade]) || 0;
      sub2grade += Number(gradeMap[studentList[i].subjects[1].theoryGrade]) || 0;
      sub3grade += Number(gradeMap[studentList[i].subjects[2].theoryGrade]) || 0;
      sub4grade += Number(gradeMap[studentList[i].subjects[3].theoryGrade]) || 0;
      sub5grade += Number(gradeMap[studentList[i].subjects[4].theoryGrade]) || 0;
      sub6grade += Number(gradeMap[studentList[i].subjects[5].theoryGrade]) || 0;
    }

    const classAvgSgpa = totalSgpa / totalStudent;

    return res.status(200).json({
      success: true,
      totalStudent,
      classAvgSgpa: Number(classAvgSgpa.toFixed(2)),
      subjects: [
        {
          subjectName: sub1name,
          average: Number((sub1grade / totalStudent).toFixed(2)),
        },
        {
          subjectName: sub2name,
          average: Number((sub2grade / totalStudent).toFixed(2)),
        },
        {
          subjectName: sub3name,
          average: Number((sub3grade / totalStudent).toFixed(2)),
        },
        {
          subjectName: sub4name,
          average: Number((sub4grade / totalStudent).toFixed(2)),
        },
        {
          subjectName: sub5name,
          average: Number((sub5grade / totalStudent).toFixed(2)),
        },
        {
          subjectName: sub6name,
          average: Number((sub6grade / totalStudent).toFixed(2)),
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};