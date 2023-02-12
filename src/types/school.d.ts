type SchoolWithUserCount = School & {
  _count: {
    users: number
  }
}
