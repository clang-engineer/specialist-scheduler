package com.clangengineer.scheduler.service

import com.clangengineer.scheduler.config.DEFAULT_LANGUAGE
import com.clangengineer.scheduler.domain.User
import com.clangengineer.scheduler.repository.AuthorityRepository
import com.clangengineer.scheduler.repository.UserRepository
import com.clangengineer.scheduler.service.dto.AdminUserDTO
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val authorityRepository: AuthorityRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun createUser(userDTO: AdminUserDTO): User {
        val user = User(
            login = userDTO.login?.toLowerCase(),
            firstName = userDTO.firstName,
            lastName = userDTO.lastName,
            email = userDTO.email?.toLowerCase(),
            imageUrl = userDTO.imageUrl,
            // default language
            langKey = userDTO.langKey ?: DEFAULT_LANGUAGE,
            password = "123123",
            resetKey = "123123",
            resetDate = Instant.now(),
            activated = true,
            createdBy = "system",
            authorities = userDTO.authorities?.let { authorities ->
                authorities.map { authorityRepository.findById(it) }
                    .filter { it.isPresent }
                    .mapTo(mutableSetOf()) { it.get() }
            } ?: mutableSetOf()
        )
        userRepository.save(user)
        log.debug("Created Information for User: {}", user)
        return user
    }
}