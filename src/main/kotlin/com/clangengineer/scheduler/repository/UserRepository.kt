package com.clangengineer.scheduler.repository

import com.clangengineer.scheduler.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long>
