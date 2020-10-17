function CourseObj(
  coursesId,
  courseName,
  Description,
  TotalTime = null,
  EffortUnit = null
) {
  this.coursesId = coursesId;
  this.courseName = courseName;
  this.Description = Description;
  this.TotalTime = TotalTime;
  this.EffortUnit = EffortUnit;
}

module.exports = CourseObj;
