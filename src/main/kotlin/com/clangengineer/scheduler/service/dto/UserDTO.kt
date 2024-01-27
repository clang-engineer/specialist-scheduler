package com.clangengineer.scheduler.service.dto

import com.clangengineer.scheduler.domain.User
import java.io.Serializable

open class UserDTO(
    var id: Long? = null,
    var login: String? = null,
) : Serializable {

    constructor(user: User) : this(user.id, user.login)

    override fun toString() = "UserDTO{" +
            "login='" + login + '\'' +
            "}"

    companion object {
        private const val serialVersionUID = 1L
    }
}
