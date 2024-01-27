package com.clangengineer.scheduler.repository

import com.clangengineer.scheduler.domain.Authority
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AuthorityRepository : JpaRepository<Authority, String>
