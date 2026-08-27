<template>
  <div class="login-page">
    <div class="login-overlay" role="presentation" aria-hidden="true"></div>

    <q-card class="login-card" flat>
      <!-- Desktop Layout -->
      <div class="desktop-layout row no-wrap">
        <!-- Left Panel - Branding -->
        <div class="col-7 desktop-branding">
          <div class="branding-content">
            <h1 class="brand-title">
              Learning and Development Management System
            </h1>
            <img
              src="/image/CityHallAnimated.png"
              alt="City Hall Animated"
              class="brand-image"
              loading="lazy"
              width="600"
              height="400"
            />
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="col-5 login-panel">
          <div class="login-form-container">
            <h2 class="login-title">Login to your account</h2>

            <q-banner
              v-if="authStore.error"
              dense
              rounded
              class="bg-red-2 text-red-9 q-mb-md"
            >
              {{ authStore.error }}
            </q-banner>

            <q-form
              @submit.prevent="handleLogin"
              ref="loginFormRef"
              class="login-form"
              autocomplete="on"
            >
              <q-input
                dense
                outlined
                v-model.trim="credentials.username"
                label="Username"
                type="text"
                lazy-rules
                :rules="usernameRules"
                class="q-mb-md"
                autocomplete="username"
                name="username"
                required
              >
                <template v-slot:prepend>
                  <q-icon name="person" size="20px" />
                </template>
              </q-input>

              <q-input
                dense
                outlined
                v-model="credentials.password"
                label="Password"
                :type="passwordFieldType"
                lazy-rules
                :rules="passwordRules"
                class="q-mb-lg"
                autocomplete="current-password"
                name="password"
                required
              >
                <template v-slot:prepend>
                  <q-icon name="lock" size="20px" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="passwordVisibilityIcon"
                    class="cursor-pointer"
                    @click="togglePasswordVisibility"
                    size="20px"
                    role="button"
                    tabindex="0"
                    aria-label="Toggle password visibility"
                    @keydown.enter="togglePasswordVisibility"
                  />
                </template>
              </q-input>

              <q-btn
                type="submit"
                color="primary"
                label="Sign In"
                class="full-width"
                :loading="authStore.isLoading"
                :disable="authStore.isLoading"
                rounded
                unelevated
                size="md"
              />

              <div class="footer-text">
                <span class="text-caption">
                  Developed by CICTMO - SPM Section
                </span>
                <span class="text-caption q-mt-sm">
                  <q-icon name="info" size="14px" class="q-mr-xs" />
                  v{{ appVersion }}
                </span>
              </div>
            </q-form>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-layout">
        <div class="mobile-header">
          <img
            src="/image/CityHallAnimated.png"
            alt="City Hall Animated"
            class="mobile-brand-image"
            loading="lazy"
            width="300"
            height="200"
          />
        </div>

        <div class="mobile-login-panel">
          <h2 class="mobile-login-title">
            Learning and Development<br />Management System
          </h2>
          <p class="mobile-login-subtitle">Login to your account</p>

          <q-banner
            v-if="authStore.error"
            dense
            rounded
            class="bg-red-2 text-red-9 q-mb-md"
          >
            {{ authStore.error }}
          </q-banner>

          <q-form
            @submit.prevent="handleLogin"
            ref="mobileLoginFormRef"
            class="login-form"
            autocomplete="on"
          >
            <q-input
              dense
              outlined
              v-model.trim="credentials.username"
              label="Username"
              type="text"
              lazy-rules
              :rules="usernameRules"
              class="q-mb-md"
              autocomplete="username"
              name="username"
              required
            >
              <template v-slot:prepend>
                <q-icon name="person" size="20px" />
              </template>
            </q-input>

            <q-input
              dense
              outlined
              v-model="credentials.password"
              label="Password"
              :type="passwordFieldType"
              lazy-rules
              :rules="passwordRules"
              class="q-mb-lg"
              autocomplete="current-password"
              name="password"
              required
            >
              <template v-slot:prepend>
                <q-icon name="lock" size="20px" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="passwordVisibilityIcon"
                  class="cursor-pointer"
                  @click="togglePasswordVisibility"
                  size="20px"
                  role="button"
                  tabindex="0"
                  aria-label="Toggle password visibility"
                  @keydown.enter="togglePasswordVisibility"
                />
              </template>
            </q-input>

            <q-btn
              type="submit"
              color="primary"
              label="Sign In"
              class="full-width"
              :loading="authStore.isLoading"
              :disable="authStore.isLoading"
              rounded
              unelevated
              size="md"
            />

            <div class="footer-text">
              <span class="text-caption">
                Developed by CICTMO - SPM Division
              </span>
              <span class="text-caption q-mt-sm">
                <q-icon name="info" size="14px" class="q-mr-xs" />
                v{{ appVersion }}
              </span>
            </div>
          </q-form>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/authStore";

export default {
  name: "LoginPage",

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    // State
    const credentials = ref({
      username: "",
      password: "",
    });

    const isPasswordVisible = ref(false);
    const loginFormRef = ref(null);
    const mobileLoginFormRef = ref(null);

    // Constants
    const appVersion = "1.0.0.1";

    // Computed
    const passwordFieldType = computed(() =>
      isPasswordVisible.value ? "text" : "password"
    );

    const passwordVisibilityIcon = computed(() =>
      isPasswordVisible.value ? "visibility_off" : "visibility"
    );

    // Validation rules
    const usernameRules = [
      (val) => (val && val.length > 0) || "Username is required",
      (val) =>
        (val && val.length >= 3) || "Username must be at least 3 characters",
    ];

    const passwordRules = [
      (val) => (val && val.length > 0) || "Password is required",
      (val) =>
        (val && val.length >= 5) || "Password must be at least 6 characters",
    ];

    // Methods
    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    const validateForms = async () => {
      const desktopValid = loginFormRef.value
        ? await loginFormRef.value.validate()
        : true;
      const mobileValid = mobileLoginFormRef.value
        ? await mobileLoginFormRef.value.validate()
        : true;
      return desktopValid && mobileValid;
    };

    const handleLogin = async () => {
      const isValid = await validateForms();
      if (!isValid) return;

      authStore.clearError();

      const result = await authStore.login({
        username: credentials.value.username,
        password: credentials.value.password,
      });

      if (result.success) {
        router.push("/admin/dashboard");
      }
      // On failure, authStore.error is already set and rendered in the banner
    };

    return {
      // Store
      authStore,

      // State
      credentials,
      loginFormRef,
      mobileLoginFormRef,

      // Computed
      passwordFieldType,
      passwordVisibilityIcon,

      // Constants
      appVersion,

      // Validation
      usernameRules,
      passwordRules,

      // Methods
      togglePasswordVisibility,
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Base Styles */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding: 20px;
}

.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/image/Bg.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: 0;
  will-change: transform;
}

.login-card {
  position: relative;
  z-index: 1;
  max-width: 900px;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

/* Desktop Layout */
.desktop-layout {
  display: flex;
  justify-content: space-between;
  min-height: 500px;
}

.desktop-branding {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 24px;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
}

.branding-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #6c757d;
  margin: 16px 0 16px 0;
  width: 60%;
  line-height: 1.3;
}

.brand-image {
  width: 100%;
  height: 100%;
  max-height: 600px;
  object-fit: contain;
  display: block;
}

/* Login Panel */
.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #abe39b 25%, #38c14aed 75%);
  border-radius: 0 24px 24px 0;
  padding: 40px;
}

.login-form-container {
  width: 100%;
  max-width: 350px;
}

.login-title {
  font-weight: 700;
  color: #495057;
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.25rem;
}

.login-form {
  width: 100%;
}

.footer-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  color: white;
}

.footer-text .text-caption {
  opacity: 0.9;
  font-size: 0.75rem;
}

/* Mobile Layout */
.mobile-layout {
  display: none;
}

.mobile-header {
  background: white;
  padding: 16px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.mobile-brand-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  display: block;
}

.mobile-login-panel {
  background: linear-gradient(135deg, #abe39b 25%, #38c14aed 75%);
  padding: 32px 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 400px;
}

.mobile-login-title {
  font-weight: 700;
  text-align: center;
  color: #495057;
  font-size: 1.25rem;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.mobile-login-subtitle {
  font-weight: 600;
  text-align: center;
  color: #495057;
  margin: 0 0 20px 0;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    display: block;
  }

  .login-card {
    max-width: 100%;
    width: 95%;
  }

  .brand-title {
    width: 80%;
    font-size: 1.25rem;
  }

  .login-form-container {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 10px;
  }

  .login-card {
    width: 100%;
    border-radius: 24px;
  }

  .mobile-header {
    min-height: 150px;
    padding: 12px;
  }

  .mobile-brand-image {
    max-height: 150px;
  }

  .mobile-login-panel {
    padding: 24px 24px;
    min-height: 300px;
  }

  .mobile-login-title {
    font-size: 1.1rem;
  }

  .mobile-login-subtitle {
    font-size: 0.9rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .login-overlay {
    background-attachment: scroll;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .login-panel,
  .mobile-login-panel {
    background: #2d8f3e;
  }
}

/* Print Styles */
@media print {
  .login-overlay {
    display: none;
  }

  .login-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
