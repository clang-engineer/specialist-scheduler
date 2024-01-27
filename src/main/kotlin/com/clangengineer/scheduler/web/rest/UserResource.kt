package com.clangengineer.scheduler.web.rest

import com.clangengineer.scheduler.domain.User
import com.clangengineer.scheduler.service.UserService
import com.clangengineer.scheduler.service.dto.AdminUserDTO
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI
import java.net.URISyntaxException

@RestController
@RequestMapping("/api/admin")
class UserResource(
    private val userService: UserService
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @PostMapping("/users")
    @Throws(URISyntaxException::class)
    fun createUser(@Valid @RequestBody userDTO: AdminUserDTO): ResponseEntity<User> {
        log.debug("REST request to save User : $userDTO")


        val newUser = userService.createUser(userDTO)
        return ResponseEntity.created(URI("/api/admin/users/${newUser.login}"))
            .body(newUser)
    }
}