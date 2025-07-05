import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ModalEditProfile({ userData, open, onClose, onSave, isSaving }) {
    const [formData, setFormData] = useState({
        id: userData?.id,
        name: userData?.name || '',
        email: userData?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const emailChanged = formData.email !== userData.email;

    useEffect(() => {
        if (!emailChanged) {
            setFormData(prev => ({
                ...prev,
                currentPassword: ''
            }));
        }
    }, [emailChanged]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTogglePassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert("As novas senhas não coincidem!");
            return;
        }

        if (formData.email === "" || formData.name === "") {
            alert("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        const emailChanged = formData.email !== userData.email;

        if (emailChanged && !formData.currentPassword) {
            alert("Para alterar o email, você deve fornecer sua senha atual");
            return;
        }

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                ...(formData.newPassword && { password: formData.newPassword }),
                ...(emailChanged && { password: formData.currentPassword })
            };

            await onSave(dataToSend);
        } finally {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="E-mail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    {emailChanged && (
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Senha Atual (obrigatória para alterar email)"
                            name="currentPassword"
                            type={showPassword.currentPassword ? 'text' : 'password'}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleTogglePassword('currentPassword')}
                                            edge="end"
                                        >
                                            {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nova Senha"
                        name="newPassword"
                        type={showPassword.newPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePassword('newPassword')}
                                        edge="end"
                                    >
                                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Confirmar Nova Senha"
                        name="confirmPassword"
                        type={showPassword.confirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePassword('confirmPassword')}
                                        edge="end"
                                    >
                                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}