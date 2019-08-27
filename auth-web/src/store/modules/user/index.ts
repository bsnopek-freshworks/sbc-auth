import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import keycloakService from '@/services/keycloak.services'
import userServices from '@/services/user.services'
import { UserInfo } from '@/models/userInfo'
import { User } from '@/models/user'
import { UserContact } from '@/models/usercontact'
import { Contact } from '@/models/contact'

@Module({
  name: 'user'
})
export default class UserModule extends VuexModule {
  currentUser: UserInfo

  userProfile: User

  userContact: UserContact

  @Mutation
  public setUserProfile (userProfile: User) {
    this.userProfile = userProfile
  }

  @Mutation
  public setCurrentUser (currentUser: UserInfo) {
    this.currentUser = currentUser
  }

  @Mutation
  public setUserContact (userContact: UserContact) {
    this.userContact = userContact
  }

  @Action({ rawError: true })
  public async initKeycloak (idpHint:string) {
    return keycloakService.init(idpHint)
  }

  @Action({ commit: 'setCurrentUser' })
  public async initializeSession () {
    // Set values to session storage
    keycloakService.initSessionStorage()
    // Load User Info
    return keycloakService.getUserInfo()
  }

  @Action({ rawError: true })
  public login (idpHint:string) {
    keycloakService.login(idpHint)
  }

  @Action({ commit: 'setUserProfile' })
  public async getUserProfile (identifier: string) {
    return userServices.getUserProfile(identifier)
      .then(response => {
        return response.data ? response.data : null
      })
  }

  @Action({ commit: 'setUserProfile' })
  public async createUserProfile () {
    return userServices.createUserProfile()
      .then(response => {
        return response.data
      })
  }

  @Action({ commit: 'setUserContact' })
  public async createUserContact (contact:Contact) {
    return userServices.createContact(contact)
      .then(response => {
        return response.data
      })
  }
}