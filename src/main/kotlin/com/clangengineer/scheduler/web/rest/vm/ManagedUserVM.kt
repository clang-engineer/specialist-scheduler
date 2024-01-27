package com.clangengineer.scheduler.web.rest.vm

import com.clangengineer.scheduler.service.dto.AdminUserDTO
import jakarta.validation.constraints.Size

class ManagedUserVM : AdminUserDTO() {

    @field:Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    var password: String? = null

    override fun toString() = "ManagedUserVM{${super.toString()}}"

    companion object {
        const val PASSWORD_MIN_LENGTH: Int = 4
        const val PASSWORD_MAX_LENGTH: Int = 100
    }
}
