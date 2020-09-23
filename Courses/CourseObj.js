function CourseObj(
  coursesId,
  courseName,
  Description,
  TotalTime = null,
  PerWeek_effort = null,
  PerDay_Effort = null
) {
  this.coursesId = coursesId;
  this.courseName = courseName;
  this.Description = Description;
  this.TotalTime = TotalTime;
  this.PerDay_Effort = PerDay_Effort;
  this.PerWeek_effort = PerWeek_effort;
}

module.exports = CourseObj;
